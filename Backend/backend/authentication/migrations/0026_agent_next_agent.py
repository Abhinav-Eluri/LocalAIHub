# Generated by Django 4.2.18 on 2025-02-24 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0025_task_agent'),
    ]

    operations = [
        migrations.AddField(
            model_name='agent',
            name='next_agent',
            field=models.CharField(default=None, max_length=256, verbose_name='Next Agent'),
        ),
    ]
