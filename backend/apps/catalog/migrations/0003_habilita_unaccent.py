from django.contrib.postgres.operations import UnaccentExtension
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0002_materia_requisitos_nivel_ensino"),
    ]

    operations = [
        UnaccentExtension(),
    ]
