import argparse
import json
import re
import time
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Campus, Departamento, Materia, Professor, Turma

# Regex para códigos de horário da UnB (ex: 24M12, 35T23, 2345N1234, 6N12)
SCHEDULE_CODE_PATTERN = re.compile(r"([2-7]+[MTN][1-6]+)")

# Regex para SIAPE em URLs do SIGAA
SIAPE_PATTERN = re.compile(r"siape=(\d+)")

# Expressões para acrônimos de departamentos (ex: /DAP, /COM)
DEPT_ACRONYM_PATTERN = re.compile(r"/([A-Z0-9]{2,10})\b")

# Palavras ignoradas na geração de siglas de departamento
DEPT_STOPWORDS = {
    "DE", "DO", "DA", "DOS", "DAS", "E", "EM", "PARA",
    "CAMPUS", "UNB", "FACULDADE", "DEPARTAMENTO", "INSTITUTO", "CENTRO"
}


def clean_schedule(raw: Optional[str]) -> str:
    """Extrai e normaliza códigos de horário oficiais da UnB a partir do texto bruto do SIGAA."""
    if not raw:
        return "A Definir"
    matches = SCHEDULE_CODE_PATTERN.findall(raw)
    if matches:
        return " ".join(matches)[:100]
    cleaned = raw.strip().split("(")[0].strip()
    return cleaned[:100] if cleaned else "A Definir"


def infer_campus_sigla(department_name: str) -> str:
    """Infere o campus da UnB a partir do nome da unidade acadêmica ou departamento."""
    upper = department_name.upper()
    if "CEILÂNDIA" in upper or "FCE" in upper or "FCTS" in upper:
        return "FCE"
    if "GAMA" in upper or "FGA" in upper:
        return "FGA"
    if "PLANALTINA" in upper or "FAL" in upper or "FUP" in upper:
        return "FAL"
    return "DARCY"


def generate_dept_code(campus_sigla: str, department_name: str, used_codes: Set[str]) -> str:
    """Gera um código único de até 20 caracteres para o departamento."""
    acronym_match = DEPT_ACRONYM_PATTERN.search(department_name)
    if acronym_match:
        base_code = acronym_match.group(1).upper()
    else:
        clean = re.sub(r"[^A-Za-z0-9\s]", "", department_name)
        words = [w.upper() for w in clean.split() if w.upper() not in DEPT_STOPWORDS]
        base_code = "".join(w[0] for w in words)[:8] if words else "DEP"

    code = f"{campus_sigla}_{base_code}"[:20]
    counter = 1
    while code in used_codes:
        suffix = f"_{counter}"
        code = f"{campus_sigla}_{base_code[: 20 - len(campus_sigla) - len(suffix) - 1]}{suffix}"[:20]
        counter += 1

    used_codes.add(code)
    return code


class Command(BaseCommand):
    help = "Ingesta e carrega dados processados do SIGAA (Campi, Departamentos, Professores, Matérias e Turmas) no Supabase/PostgreSQL."

    def add_arguments(self, parser: argparse.ArgumentParser):
        base_pipeline_dir = settings.BASE_DIR.parent / "unbook-data-pipeline" / "data"

        parser.add_argument(
            "--classes-file",
            type=str,
            default=str(base_pipeline_dir / "raw" / "scraped" / "sigaa_classes.json"),
            help="Caminho para o JSON de turmas extraídas do SIGAA (padrão: sigaa_classes.json)",
        )
        parser.add_argument(
            "--professors-file",
            type=str,
            default=str(base_pipeline_dir / "raw" / "sigaa" / "seed_professores.json"),
            help="Caminho para o JSON de professores do SIGAA (padrão: seed_professores.json)",
        )
        parser.add_argument(
            "--enriched-professors-file",
            type=str,
            default=str(base_pipeline_dir / "processed" / "sigaa_professores.json"),
            help="Caminho para o JSON de professores enriquecidos via spider (opcional)",
        )
        parser.add_argument(
            "--semester",
            type=str,
            default="2026.1",
            help="Semestre letivo padrão para as turmas (ex: 2026.1, 2026.2)",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Limite máximo de registros a processar para testes rápidos",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Executa a carga em modo simulação (faz rollback da transação sem alterar o banco)",
        )
        parser.add_argument(
            "--skip-professors",
            action="store_true",
            help="Pula a etapa de carga dos professores",
        )
        parser.add_argument(
            "--skip-classes",
            action="store_true",
            help="Pula a etapa de carga de matérias e turmas",
        )

    def handle(self, *args, **options):
        start_time = time.time()
        dry_run = options["dry_run"]
        limit = options.get("limit")
        semester = options["semester"]

        self.stdout.write(self.style.HTTP_INFO("=" * 65))
        self.stdout.write(self.style.HTTP_INFO("🚀 UNBOOK 2.0 - COMANDO DE INGESTÃO E CARGA DO SIGAA"))
        if dry_run:
            self.stdout.write(self.style.WARNING("⚠️  MODO DRY-RUN ATIVADO: Nenhuma alteração será salva no banco."))
        if limit:
            self.stdout.write(self.style.NOTICE(f"🔍 Limite configurado: {limit} registros."))
        self.stdout.write(self.style.HTTP_INFO("=" * 65))

        stats = {
            "campi_created": 0,
            "dept_created": 0,
            "dept_existing": 0,
            "prof_created": 0,
            "prof_updated": 0,
            "materia_created": 0,
            "materia_existing": 0,
            "turma_created": 0,
            "turma_updated": 0,
        }

        try:
            with transaction.atomic():
                # 1. Carrega ou Inicializa os Campi
                campi_map = self._setup_campi(stats)

                # 2. Carga de Professores e Departamentos
                known_profs: Dict[str, Professor] = {}
                if not options["skip_professors"]:
                    known_profs = self._load_professors(
                        professors_file=options["professors_file"],
                        enriched_file=options["enriched_professors_file"],
                        campi_map=campi_map,
                        limit=limit,
                        stats=stats,
                    )
                else:
                    self.stdout.write(self.style.WARNING("⏩ Pulando carga de professores."))
                    for prof in Professor.objects.all():
                        known_profs[prof.nome_completo.strip().upper()] = prof

                # 3. Carga de Matérias e Turmas
                if not options["skip_classes"]:
                    self._load_classes(
                        classes_file=options["classes_file"],
                        campi_map=campi_map,
                        known_profs=known_profs,
                        semester=semester,
                        limit=limit,
                        stats=stats,
                    )
                else:
                    self.stdout.write(self.style.WARNING("⏩ Pulando carga de turmas."))

                if dry_run:
                    transaction.set_rollback(True)
                    self.stdout.write(self.style.WARNING("\n🔄 Rollback efetuado com sucesso (Dry-run)."))

        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"\n❌ Erro crítico durante a ingestão: {exc}"))
            raise exc

        elapsed = time.time() - start_time
        self.stdout.write(self.style.HTTP_INFO("=" * 65))
        self.stdout.write(self.style.SUCCESS(f"✅ Ingestão finalizada em {elapsed:.2f} segundos!"))
        self.stdout.write(f"  • Campi criados:        {stats['campi_created']}")
        self.stdout.write(f"  • Departamentos novos:  {stats['dept_created']} (Existentes: {stats['dept_existing']})")
        self.stdout.write(f"  • Professores novos:    {stats['prof_created']} (Atualizados: {stats['prof_updated']})")
        self.stdout.write(f"  • Matérias novas:       {stats['materia_created']} (Existentes: {stats['materia_existing']})")
        self.stdout.write(f"  • Turmas criadas/at.:   {stats['turma_created']} criadas, {stats['turma_updated']} atualizadas")
        self.stdout.write(self.style.HTTP_INFO("=" * 65))

    def _setup_campi(self, stats: Dict[str, int]) -> Dict[str, Campus]:
        """Garante a existência dos 4 campi oficiais da UnB."""
        defaults = {
            "DARCY": "Campus Darcy Ribeiro (Plano Piloto)",
            "FGA": "Faculdade UnB Gama",
            "FCE": "Faculdade UnB Ceilândia",
            "FAL": "Faculdade UnB Planaltina",
        }
        campi_map = {}
        for sigla, nome in defaults.items():
            campus, created = Campus.objects.get_or_create(
                sigla=sigla,
                defaults={"nome": nome},
            )
            campi_map[sigla] = campus
            if created:
                stats["campi_created"] += 1
        return campi_map

    def _load_professors(
        self,
        professors_file: str,
        enriched_file: str,
        campi_map: Dict[str, Campus],
        limit: Optional[int],
        stats: Dict[str, int],
    ) -> Dict[str, Professor]:
        """Carrega e sincroniza os docentes com otimização em lote (bulk)."""
        prof_path = Path(professors_file)
        if not prof_path.exists():
            self.stdout.write(self.style.WARNING(f"⚠️  Arquivo de professores não encontrado: {prof_path}"))
            return {}

        self.stdout.write(f"📖 Lendo docentes de {prof_path.name}...")
        with open(prof_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        if limit:
            raw_data = raw_data[:limit]

        # Enriquecimento opcional se houver dados da spider
        enriched_map = {}
        enriched_path = Path(enriched_file)
        if enriched_path.exists():
            try:
                with open(enriched_path, "r", encoding="utf-8") as f:
                    enriched_list = json.load(f)
                    for item in enriched_list:
                        key = (item.get("nome") or "").strip().upper()
                        if key:
                            enriched_map[key] = item
                self.stdout.write(f"✨ Encontrados {len(enriched_map)} docentes enriquecidos em {enriched_path.name}.")
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Aviso ao ler enriquecidos: {e}"))

        # Caches em memória para departamentos
        dept_by_name: Dict[str, Departamento] = {d.nome.strip().upper(): d for d in Departamento.objects.all()}
        used_dept_codes = set(Departamento.objects.values_list("codigo", flat=True))
        stats["dept_existing"] = len(dept_by_name)

        # 1. Criação em lote de departamentos ausentes
        new_depts: List[Departamento] = []
        for item in raw_data:
            dept_name = (item.get("departamento") or "").strip()
            if dept_name and dept_name.upper() not in dept_by_name:
                campus_sigla = infer_campus_sigla(dept_name)
                campus = campi_map[campus_sigla]
                dept_code = generate_dept_code(campus_sigla, dept_name, used_dept_codes)
                new_d = Departamento(
                    campus=campus,
                    codigo=dept_code,
                    nome=dept_name[:150],
                )
                dept_by_name[dept_name.upper()] = new_d
                new_depts.append(new_d)

        if new_depts:
            Departamento.objects.bulk_create(new_depts, batch_size=500)
            stats["dept_created"] += len(new_depts)
            # Recarrega dept_by_name com IDs gerados
            dept_by_name = {d.nome.strip().upper(): d for d in Departamento.objects.all()}

        # Caches em memória para professores existentes
        existing_by_siape = {
            p.siape: p for p in Professor.objects.exclude(siape__isnull=True).exclude(siape="")
        }
        existing_by_name = {
            p.nome_completo.strip().upper(): p for p in Professor.objects.all()
        }
        used_slugs = set(Professor.objects.values_list("slug", flat=True))

        profs_to_create: List[Professor] = []
        profs_to_update: List[Professor] = []
        known_profs: Dict[str, Professor] = dict(existing_by_name)

        for item in raw_data:
            name = (item.get("professor") or item.get("nome") or "").strip()
            if not name:
                continue

            name_upper = name.upper()
            dept_name = (item.get("departamento") or "").strip()
            dept = dept_by_name.get(dept_name.upper()) if dept_name else None

            # Extração de SIAPE
            link_info = item.get("link_mais_info") or item.get("link_siape") or ""
            siape_match = SIAPE_PATTERN.search(link_info)
            siape = siape_match.group(1) if siape_match else None

            # Dados enriquecidos
            enrich = enriched_map.get(name_upper, {})
            email = enrich.get("email") or None
            lattes = enrich.get("curriculo_lattes") or None
            sala = enrich.get("sala")
            if sala and sala.lower() in {"não informado", "não informada", ""}:
                sala = None
            url_foto = item.get("link_imagem") or item.get("imagem") or None
            if url_foto and len(url_foto) > 200:
                url_foto = None

            # Verifica se já existe por SIAPE ou por Nome
            existing_prof = existing_by_siape.get(siape) if siape else None
            if not existing_prof:
                existing_prof = existing_by_name.get(name_upper)

            if existing_prof:
                updated = False
                if siape and not existing_prof.siape:
                    existing_prof.siape = siape
                    updated = True
                if url_foto and not existing_prof.url_foto:
                    existing_prof.url_foto = url_foto
                    updated = True
                if dept and not existing_prof.departamento_id:
                    existing_prof.departamento = dept
                    updated = True
                if email and not existing_prof.email_institucional:
                    existing_prof.email_institucional = email
                    updated = True
                if lattes and not existing_prof.url_lattes:
                    existing_prof.url_lattes = lattes
                    updated = True
                if sala and not existing_prof.localizacao_gabinete:
                    existing_prof.localizacao_gabinete = sala[:150]
                    updated = True

                if updated:
                    profs_to_update.append(existing_prof)
                    stats["prof_updated"] += 1
                known_profs[name_upper] = existing_prof
            else:
                base_slug = slugify(name)[:140] or "prof"
                slug = f"{base_slug}-{siape}" if siape else base_slug
                counter = 1
                while slug in used_slugs:
                    slug = f"{base_slug}-{counter}"[:200]
                    counter += 1
                used_slugs.add(slug)

                new_prof = Professor(
                    nome_completo=name[:200],
                    slug=slug,
                    siape=siape,
                    departamento=dept,
                    email_institucional=email,
                    url_foto=url_foto,
                    url_lattes=lattes,
                    localizacao_gabinete=sala[:150] if sala else None,
                )
                profs_to_create.append(new_prof)
                stats["prof_created"] += 1
                known_profs[name_upper] = new_prof
                existing_by_name[name_upper] = new_prof
                if siape:
                    existing_by_siape[siape] = new_prof

        # Execução das inserções e atualizações em lote (bulk)
        if profs_to_create:
            Professor.objects.bulk_create(profs_to_create, batch_size=500)
            self.stdout.write(self.style.SUCCESS(f"  ✓ {len(profs_to_create)} novos professores inseridos em lote."))
            # Atualiza known_profs com as instâncias criadas que agora têm PK
            for p in Professor.objects.filter(slug__in=[pr.slug for pr in profs_to_create]):
                known_profs[p.nome_completo.strip().upper()] = p

        if profs_to_update:
            Professor.objects.bulk_update(
                profs_to_update,
                fields=["siape", "departamento", "url_foto", "email_institucional", "url_lattes", "localizacao_gabinete"],
                batch_size=500,
            )
            self.stdout.write(self.style.SUCCESS(f"  ✓ {len(profs_to_update)} professores atualizados em lote."))

        return known_profs

    def _load_classes(
        self,
        classes_file: str,
        campi_map: Dict[str, Campus],
        known_profs: Dict[str, Professor],
        semester: str,
        limit: Optional[int],
        stats: Dict[str, int],
    ):
        """Carrega matérias e turmas do SIGAA de forma 100% vetorizada/bulk."""
        classes_path = Path(classes_file)
        if not classes_path.exists():
            self.stdout.write(self.style.WARNING(f"⚠️  Arquivo de turmas não encontrado: {classes_path}"))
            return

        self.stdout.write(f"📖 Lendo turmas de {classes_path.name}...")
        with open(classes_path, "r", encoding="utf-8") as f:
            classes_data = json.load(f)

        if limit:
            classes_data = classes_data[:limit]

        # Departamentos em memória
        dept_by_name: Dict[str, Departamento] = {d.nome.strip().upper(): d for d in Departamento.objects.all()}
        used_dept_codes = set(Departamento.objects.values_list("codigo", flat=True))
        default_dept = list(dept_by_name.values())[0] if dept_by_name else None

        # 1. Garante departamentos das matérias
        new_depts: List[Departamento] = []
        for c in classes_data:
            dept_name = (c.get("departamento") or "").strip()
            if dept_name and dept_name.upper() not in dept_by_name:
                campus_sigla = infer_campus_sigla(dept_name)
                campus = campi_map[campus_sigla]
                dept_code = generate_dept_code(campus_sigla, dept_name, used_dept_codes)
                new_d = Departamento(
                    campus=campus,
                    codigo=dept_code,
                    nome=dept_name[:150],
                )
                dept_by_name[dept_name.upper()] = new_d
                new_depts.append(new_d)

        if new_depts:
            Departamento.objects.bulk_create(new_depts, batch_size=500)
            stats["dept_created"] += len(new_depts)
            dept_by_name = {d.nome.strip().upper(): d for d in Departamento.objects.all()}

        # 2. Resolução em lote de Matérias
        materias_by_code: Dict[str, Materia] = {
            m.codigo_materia.upper(): m for m in Materia.objects.all()
        }
        stats["materia_existing"] = len(materias_by_code)

        new_materias: List[Materia] = []
        for c in classes_data:
            code = (c.get("course_code") or "").strip().upper()
            name = (c.get("course_name") or "").strip().upper()
            if not code or not name:
                continue

            if code not in materias_by_code:
                dept_name = (c.get("departamento") or "").strip()
                dept = dept_by_name.get(dept_name.upper(), default_dept)
                materia_slug = slugify(f"{code}-{name}")[:200]
                new_mat = Materia(
                    codigo_materia=code,
                    nome=name[:200],
                    slug=materia_slug,
                    departamento=dept,
                )
                materias_by_code[code] = new_mat
                new_materias.append(new_mat)

        if new_materias:
            Materia.objects.bulk_create(new_materias, batch_size=500)
            stats["materia_created"] += len(new_materias)
            self.stdout.write(self.style.SUCCESS(f"  ✓ {len(new_materias)} matérias criadas em lote."))
            # Atualiza dicionário com instâncias que agora têm IDs do banco
            for m in Materia.objects.filter(codigo_materia__in=[mat.codigo_materia for mat in new_materias]):
                materias_by_code[m.codigo_materia.upper()] = m

        # 3. Resolução de Professores Ausentes (Docentes que não estavam no seed)
        sorted_profs_names = sorted(known_profs.keys(), key=len, reverse=True)
        new_profs_to_create: List[Professor] = []
        used_slugs = set(Professor.objects.values_list("slug", flat=True))

        for c in classes_data:
            raw_docente = (c.get("docente") or "").strip().upper()
            if raw_docente and raw_docente != "A DEFINIR DOCENTE":
                # Verifica correspondência
                matched = known_profs.get(raw_docente)
                if not matched:
                    for p_name in sorted_profs_names:
                        if p_name in raw_docente:
                            matched = known_profs[p_name]
                            break

                if not matched:
                    clean_name = raw_docente[:200].title()
                    prof_slug = slugify(clean_name)[:190]
                    counter = 1
                    while prof_slug in used_slugs:
                        prof_slug = f"{prof_slug[:180]}-{counter}"
                        counter += 1
                    used_slugs.add(prof_slug)

                    dept_name = (c.get("departamento") or "").strip()
                    dept = dept_by_name.get(dept_name.upper(), default_dept)

                    new_p = Professor(
                        nome_completo=clean_name,
                        slug=prof_slug,
                        departamento=dept,
                    )
                    new_profs_to_create.append(new_p)
                    known_profs[raw_docente] = new_p

        if new_profs_to_create:
            Professor.objects.bulk_create(new_profs_to_create, batch_size=500)
            for p in Professor.objects.filter(slug__in=[pr.slug for pr in new_profs_to_create]):
                known_profs[p.nome_completo.strip().upper()] = p

        # 4. Resolução em lote de Turmas
        existing_turmas = {
            (t.materia_id, t.codigo_turma): t
            for t in Turma.objects.filter(semestre=semester).select_related("materia")
        }

        turmas_to_create: List[Turma] = []
        turmas_to_update: List[Turma] = []
        processed_turmas_in_run: Set[Tuple[str, str]] = set()

        for c in classes_data:
            course_code = (c.get("course_code") or "").strip().upper()
            materia = materias_by_code.get(course_code)
            if not materia:
                continue

            class_code = (c.get("class_code") or "01").strip()
            turma_key = (materia.id, class_code)

            # Evita duplicatas dentro do próprio JSON (ex: FCE0794-03)
            if turma_key in processed_turmas_in_run:
                continue
            processed_turmas_in_run.add(turma_key)

            # Resolução do Professor
            raw_docente = (c.get("docente") or "").strip().upper()
            matched_prof = None
            if raw_docente and raw_docente != "A DEFINIR DOCENTE":
                matched_prof = known_profs.get(raw_docente)
                if not matched_prof:
                    for p_name in sorted_profs_names:
                        if p_name in raw_docente:
                            matched_prof = known_profs[p_name]
                            break

            clean_horario = clean_schedule(c.get("schedules_raw"))
            location = (c.get("location") or "").strip()[:150]
            vacancies = c.get("vacancies") or 0

            existing = existing_turmas.get(turma_key)
            if existing:
                existing.professor = matched_prof
                existing.horario_bruto = clean_horario
                existing.local_sala = location if location else None
                existing.vagas_ofertadas = vacancies
                turmas_to_update.append(existing)
                stats["turma_updated"] += 1
            else:
                new_t = Turma(
                    materia=materia,
                    semestre=semester,
                    codigo_turma=class_code,
                    professor=matched_prof,
                    horario_bruto=clean_horario,
                    local_sala=location if location else None,
                    vagas_ofertadas=vacancies,
                    vagas_ocupadas=0,
                )
                turmas_to_create.append(new_t)
                stats["turma_created"] += 1

        if turmas_to_create:
            Turma.objects.bulk_create(turmas_to_create, batch_size=500)
        if turmas_to_update:
            Turma.objects.bulk_update(
                turmas_to_update,
                fields=["professor", "horario_bruto", "local_sala", "vagas_ofertadas"],
                batch_size=500,
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"  ✓ Processamento de turmas concluído: {stats['turma_created']} criadas, {stats['turma_updated']} atualizadas."
            )
        )
