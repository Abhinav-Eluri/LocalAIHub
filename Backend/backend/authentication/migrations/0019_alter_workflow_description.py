# Generated by Django 4.2.18 on 2025-02-21 13:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0018_remove_product_images_delete_image_delete_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflow',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
