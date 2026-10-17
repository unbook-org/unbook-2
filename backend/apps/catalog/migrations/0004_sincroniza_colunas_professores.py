from django.db import migrations
from django.utils.text import slugify


def sincronizar_colunas_professores(apps, schema_editor):
    if schema_editor.connection.vendor == "postgresql":
        with schema_editor.connection.cursor() as cursor:
            cursor.execute(
                "ALTER TABLE professores ADD COLUMN IF NOT EXISTS slug VARCHAR(200);"
            )
            cursor.execute(
                "ALTER TABLE professores ADD COLUMN IF NOT EXISTS titulo_academico VARCHAR(50);"
            )

    Professor = apps.get_model("catalog", "Professor")
    db_alias = schema_editor.connection.alias

    profs = (
        Professor.objects.using(db_alias)
        .filter(slug__isnull=True)
        .order_by("nome_completo", "id")
    )
    if not profs.exists():
        if schema_editor.connection.vendor == "postgresql":
            with schema_editor.connection.cursor() as cursor:
                cursor.execute(
                    "CREATE UNIQUE INDEX IF NOT EXISTS professores_slug_idx ON professores(slug);"
                )
        return

    used_slugs = set(
        Professor.objects.using(db_alias)
        .exclude(slug__isnull=True)
        .exclude(slug="")
        .values_list("slug", flat=True)
    )

    para_atualizar = []
    for prof in profs:
        base_slug = slugify(prof.nome_completo) or f"prof-{str(prof.id)[:8]}"
        final_slug = base_slug
        counter = 1
        while final_slug in used_slugs:
            counter += 1
            final_slug = f"{base_slug[:180]}-{counter}"
        prof.slug = final_slug
        used_slugs.add(final_slug)
        para_atualizar.append(prof)

    if para_atualizar:
        Professor.objects.using(db_alias).bulk_update(
            para_atualizar, ["slug"], batch_size=500
        )

    if schema_editor.connection.vendor == "postgresql":
        with schema_editor.connection.cursor() as cursor:
            cursor.execute(
                "CREATE UNIQUE INDEX IF NOT EXISTS professores_slug_idx ON professores(slug);"
            )


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0003_habilita_unaccent"),
    ]

    operations = [
        migrations.RunPython(
            code=sincronizar_colunas_professores,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
