# Generated by Django 4.2.5 on 2023-09-27 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_profile_fullname'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(choices=[('category0', 'Nổi bật'), ('category1', 'Sách văn học'), ('category2', 'Sách kinh tế'), ('category3', 'Sách thiếu nhi'), ('category4', 'Sách giáo khoa'), ('category5', 'Sách ngoại ngữ'), ('category6', 'Tâm lý - kĩ năng sống'), ('category7', 'Tiểu sử - hồi ký')], default='category0', max_length=30),
        ),
        migrations.AlterField(
            model_name='sliderhome',
            name='url',
            field=models.CharField(blank=True, default='/', max_length=200, null=True),
        ),
    ]
