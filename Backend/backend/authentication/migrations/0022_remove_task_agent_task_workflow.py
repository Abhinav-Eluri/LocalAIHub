# Generated by Django 4.2.18 on 2025-02-23 19:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0021_agent_agent_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='agent',
        ),
        migrations.AddField(
            model_name='task',
            name='workflow',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='authentication.workflow'),
        ),
    ]
