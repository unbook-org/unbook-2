import argparse
import hashlib
import json
import re
import time
import unicodedata
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Campus, Departamento, Materia, Professor
from review.models import Avaliacao


def normalize_text(text: Optional[str]) -> str:
    """Normaliza texto removendo acentos e espaços excessivos."""
    if not text:
        return ""
    nfkd = unicodedata.normalize("NFKD", str(text))
    without_accents = "".join(c for c in nfkd if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", without_accents).strip().upper()


class Command(BaseCommand):
    help = "Ingesta e carrega as avaliações legadas sanitizadas do pipeline no Supabase/PostgreSQL (100% vetorizado/bulk)."

    def add_arguments(self, parser: argparse.ArgumentParser):
        base_pipeline_dir = settings.BASE_DIR.parent / "unbook-data-pipeline" / "data"

        parser.add_argument(
            "--reviews-file",
            type=str,
            default=str(base_pipeline_dir / "processed" / "legacy_reviews.json"),
            help="Caminho para o JSON de avaliações processadas (padrão: legacy_reviews.json)",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Limite máximo de avaliações a processar para testes rápidos",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Executa a carga em modo simulação (faz rollback sem alterar o banco)",
        )

    def handle(self, *args, **options):
        start_time = time.time()
        dry_run = options["dry_run"]
        limit = options.get("limit")
        reviews_file = options["reviews_file"]

        self.stdout.write(self.style.HTTP_INFO("=" * 65))
        self.stdout.write(self.style.HTTP_INFO("🚀 UNBOOK 2.0 - CARGA DE AVALIAÇÕES HISTÓRICAS (BULK)"))
        if dry_run:
            self.stdout.write(self.style.WARNING("⚠️  MODO DRY-RUN ATIVADO: Nenhuma alteração será salva no banco."))
        if limit:
            self.stdout.write(self.style.NOTICE(f"🔍 Limite configurado: {limit} avaliações."))
        self.stdout.write(self.style.HTTP_INFO("=" * 65))

        path = Path(reviews_file)
        if not path.exists():
            self.stderr.write(self.style.ERROR(f"❌ Arquivo não encontrado: {path}"))
            return

        with open(path, "r", encoding="utf-8") as f:
            raw_reviews = json.load(f)

        if limit:
            raw_reviews = raw_reviews[:limit]

        self.stdout.write(f"📖 Lendo {len(raw_reviews)} avaliações de {path.name}...")

        default_dept = Departamento.objects.first()

        diff_map = {
            "muito fácil": 1,
            "fácil": 2,
            "médio": 3,
            "difícil": 4,
            "muito difícil": 5,
        }

        try:
            with transaction.atomic():
                # -------------------------------------------------------------
                # 1. Carrega caches em memória
                # -------------------------------------------------------------
                prof_by_name = {normalize_text(p.nome_completo): p for p in Professor.objects.all()}
                sorted_profs = sorted([(k, v) for k, v in prof_by_name.items()], key=lambda x: len(x[0]), reverse=True)

                materia_by_code = {m.codigo_materia.strip().upper(): m for m in Materia.objects.all()}
                materia_by_name = {normalize_text(m.nome): m for m in Materia.objects.all()}

                # -------------------------------------------------------------
                # 2. Resolução em lote de Professores Ausentes
                # -------------------------------------------------------------
                profs_to_create = []
                used_slugs = set(Professor.objects.values_list("slug", flat=True))

                for r in raw_reviews:
                    raw_prof = (r.get("professor_name") or "").strip()
                    norm_prof = normalize_text(raw_prof)
                    if not norm_prof or len(norm_prof) < 3 or norm_prof in prof_by_name:
                        continue

                    # Tenta substring
                    matched = None
                    for p_key, p_inst in sorted_profs:
                        if norm_prof in p_key or p_key in norm_prof:
                            matched = p_inst
                            break
                    if matched:
                        prof_by_name[norm_prof] = matched
                        continue

                    clean_prof_name = raw_prof.title()
                    prof_slug = slugify(clean_prof_name)[:180] or "prof"
                    counter = 1
                    base_slug = prof_slug
                    while prof_slug in used_slugs:
                        prof_slug = f"{base_slug[:170]}-{counter}"
                        counter += 1
                    used_slugs.add(prof_slug)

                    new_p = Professor(
                        nome_completo=clean_prof_name,
                        slug=prof_slug,
                        departamento=default_dept,
                    )
                    profs_to_create.append(new_p)
                    prof_by_name[norm_prof] = new_p

                if profs_to_create:
                    Professor.objects.bulk_create(profs_to_create, batch_size=500)
                    self.stdout.write(self.style.SUCCESS(f"  ✓ {len(profs_to_create)} novos professores criados em lote."))
                    prof_by_name = {normalize_text(p.nome_completo): p for p in Professor.objects.all()}
                    sorted_profs = sorted([(k, v) for k, v in prof_by_name.items()], key=lambda x: len(x[0]), reverse=True)

                # -------------------------------------------------------------
                # 3. Resolução em lote de Matérias Ausentes
                # -------------------------------------------------------------
                materias_to_create = []
                used_mat_codes = set(Materia.objects.values_list("codigo_materia", flat=True))

                for r in raw_reviews:
                    course_code = (r.get("course_code") or "").strip().upper()
                    course_name = (r.get("course_name") or "").strip()
                    norm_course = normalize_text(course_name)

                    if course_code and course_code in materia_by_code:
                        continue
                    if not course_code and norm_course and norm_course in materia_by_name:
                        continue
                    if not course_code and not norm_course:
                        continue

                    code_to_use = course_code or f"LEG_{uuid.uuid4().hex[:6].upper()}"
                    while code_to_use in used_mat_codes:
                        code_to_use = f"LEG_{uuid.uuid4().hex[:6].upper()}"
                    used_mat_codes.add(code_to_use)

                    name_to_use = (course_name or f"Disciplina {code_to_use}")[:200]
                    mat_slug = slugify(f"{code_to_use}-{name_to_use}")[:190]

                    new_mat = Materia(
                        codigo_materia=code_to_use,
                        nome=name_to_use,
                        slug=f"{mat_slug}-{uuid.uuid4().hex[:4]}",
                        departamento=default_dept,
                    )
                    materias_to_create.append(new_mat)
                    materia_by_code[code_to_use] = new_mat
                    if norm_course:
                        materia_by_name[norm_course] = new_mat

                if materias_to_create:
                    Materia.objects.bulk_create(materias_to_create, batch_size=500)
                    self.stdout.write(self.style.SUCCESS(f"  ✓ {len(materias_to_create)} novas matérias criadas em lote."))
                    materia_by_code = {m.codigo_materia.strip().upper(): m for m in Materia.objects.all()}
                    materia_by_name = {normalize_text(m.nome): m for m in Materia.objects.all()}

                # -------------------------------------------------------------
                # 4. Construção e Inserção em lote das Avaliações
                # -------------------------------------------------------------
                existing_hashes = set(Avaliacao.objects.values_list("hash_anonimo", flat=True))
                avaliacoes_to_create = []
                skipped_count = 0

                for idx, r in enumerate(raw_reviews):
                    comment = (r.get("comment") or "").strip()
                    raw_prof = (r.get("professor_name") or "").strip()
                    norm_prof = normalize_text(raw_prof)
                    course_code = (r.get("course_code") or "").strip().upper()
                    course_name = (r.get("course_name") or "").strip()
                    norm_course = normalize_text(course_name)

                    # Docente
                    matched_prof = prof_by_name.get(norm_prof)
                    if not matched_prof and norm_prof:
                        for p_key, p_inst in sorted_profs:
                            if norm_prof in p_key or p_key in norm_prof:
                                matched_prof = p_inst
                                break

                    # Matéria
                    matched_materia = None
                    if course_code:
                        matched_materia = materia_by_code.get(course_code)
                    if not matched_materia and norm_course:
                        matched_materia = materia_by_name.get(norm_course)

                    if not matched_prof or not matched_materia:
                        skipped_count += 1
                        continue

                    # Hash Anonimo Zero-Knowledge
                    base_str = f"legacy|{matched_prof.id}|{matched_materia.id}|{comment[:100]}|{idx}"
                    hash_anonimo = hashlib.sha256(base_str.encode("utf-8")).hexdigest()

                    if hash_anonimo in existing_hashes:
                        skipped_count += 1
                        continue

                    rating_obj = r.get("rating") or {}
                    didactics_raw = rating_obj.get("didactics")
                    if didactics_raw is not None:
                        try:
                            val = float(didactics_raw)
                            nota_didatica = max(1, min(5, round(val / 2.0)))
                        except (ValueError, TypeError):
                            nota_didatica = 3
                    else:
                        nota_didatica = 3

                    diff_raw = str(rating_obj.get("difficulty") or "").lower().strip()
                    nota_dificuldade = diff_map.get(diff_raw, 3)

                    outcome_raw = str(r.get("outcome") or "passed").lower()
                    if "pass" in outcome_raw:
                        status_aprovacao = "passei"
                    elif "fail" in outcome_raw or "rep" in outcome_raw:
                        status_aprovacao = "reprovei"
                    else:
                        status_aprovacao = "tranquei"

                    emoji_vibe = str(rating_obj.get("emoji_vibe") or "😎")[:10]
                    cobra_presenca = bool(re.search(r"chamada|presen[çc]a|falta", comment, re.IGNORECASE))
                    avaliacao_justa = rating_obj.get("recommended") is not False

                    avaliacao = Avaliacao(
                        materia=matched_materia,
                        professor=matched_prof,
                        turma=None,
                        hash_anonimo=hash_anonimo,
                        nota_didatica=nota_didatica,
                        nota_dificuldade=nota_dificuldade,
                        mencao_obtida=rating_obj.get("grade_attained") or None,
                        status_aprovacao=status_aprovacao,
                        emoji_vibe=emoji_vibe,
                        cobra_presenca=cobra_presenca,
                        avaliacao_justa=avaliacao_justa,
                        possui_monitoria=False,
                        comentario=comment or None,
                        status_moderacao=Avaliacao.StatusModeracao.PUBLICADA,
                    )
                    avaliacoes_to_create.append(avaliacao)
                    existing_hashes.add(hash_anonimo)

                created_count = 0
                if avaliacoes_to_create:
                    Avaliacao.objects.bulk_create(avaliacoes_to_create, batch_size=500, ignore_conflicts=True)
                    created_count = len(avaliacoes_to_create)

                if dry_run:
                    transaction.set_rollback(True)
                    self.stdout.write(self.style.WARNING("\n🔄 Rollback efetuado com sucesso (Dry-run)."))

        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"\n❌ Erro crítico ao carregar avaliações: {exc}"))
            raise exc

        elapsed = time.time() - start_time
        self.stdout.write(self.style.HTTP_INFO("=" * 65))
        self.stdout.write(self.style.SUCCESS(f"✅ Carga finalizada em {elapsed:.2f}s!"))
        self.stdout.write(f"  • Matérias novas criadas: {len(materias_to_create)}")
        self.stdout.write(f"  • Avaliações inseridas:   {created_count}")
        self.stdout.write(f"  • Avaliações puladas:     {skipped_count}")
        self.stdout.write(self.style.HTTP_INFO("=" * 65))
