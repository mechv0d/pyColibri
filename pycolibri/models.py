from django.db import models
from django.contrib.auth.models import AbstractUser


class Client(models.Model):
    phonecode = models.CharField(max_length=3)
    phonenum = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=64)

    class Meta:
        db_table = 'pycolibri_auth'


class User(AbstractUser):
    class Meta:
        db_table = 'auth_user'


class PycolibriProfile(models.Model):
    birthdate = models.DateField()
    height = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    gender = models.BooleanField()
    uid = models.OneToOneField(
        Client,
        on_delete=models.CASCADE,
        db_column='uid',
        primary_key=True
    )

    class Meta:
        db_table = 'pycolibri_profile'
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


class PycolibriDish(models.Model):
    name = models.TextField()
    photo = models.CharField(max_length=32, blank=True, null=True)
    descr = models.TextField()
    ev_cal = models.IntegerField()
    ev_fats = models.DecimalField(max_digits=4, decimal_places=1)
    ev_proteins = models.DecimalField(max_digits=4, decimal_places=1)
    ev_carbohydrates = models.DecimalField(max_digits=4, decimal_places=1)
    uid = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        db_column='uid'
    )

    class Meta:
        db_table = 'pycolibri_dish'
        verbose_name = 'Блюдо'
        verbose_name_plural = 'Блюда'


class PycolibriMeal(models.Model):
    meal_datetime = models.DateTimeField()
    extra_name = models.CharField(max_length=50, blank=True, null=True)
    extra_weight = models.IntegerField(blank=True, null=True)
    extra_ev_cal = models.IntegerField(blank=True, null=True)
    extra_ev_fats = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )
    extra_ev_proteins = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )
    extra_ev_carbohydrates = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )
    uid = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        db_column='uid'
    )

    class Meta:
        db_table = 'pycolibri_meal'
        verbose_name = 'Приём пищи'
        verbose_name_plural = 'Приёмы пищи'


class PycolibriPortion(models.Model):
    meal = models.ForeignKey(
        PycolibriMeal,
        on_delete=models.CASCADE,
        db_column='meal_id'
    )
    dish = models.ForeignKey(
        PycolibriDish,
        on_delete=models.CASCADE,
        db_column='dish_id'
    )
    weight = models.IntegerField()

    class Meta:
        db_table = 'pycolibri_portion'
        verbose_name = 'Порция'
        verbose_name_plural = 'Порции'


class PycolibriIntermediateResult(models.Model):
    date = models.DateField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    uid = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        db_column='uid'
    )

    class Meta:
        db_table = 'pycolibri_intermediate_result'
        verbose_name = 'Замер веса'
        verbose_name_plural = 'Замеры веса'
        unique_together = ('uid', 'date')


class PycolibriFeedback(models.Model):
    STATUS_CHOICES = [
        (0, 'Новое'),
        (1, 'В обработке'),
        (2, 'Решено'),
        (3, 'Отклонено'),
    ]

    email = models.CharField(max_length=100)
    message = models.TextField()
    send_time = models.DateTimeField()
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    uid = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        db_column='uid'
    )

    class Meta:
        db_table = 'pycolibri_feedback'
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратная связь'


class PycolibriBlogContent(models.Model):
    size = models.IntegerField()
    title = models.TextField()
    photo = models.CharField(max_length=32)
    url = models.TextField(unique=True)

    class Meta:
        db_table = 'pycolibri_blog_content'
        verbose_name = 'Запись блога'
        verbose_name_plural = 'Записи блога'


class PycolibriIrStatisticItem(models.Model):
    text = models.TextField()
    is_red = models.BooleanField(default=False)
    rid = models.ForeignKey(
        PycolibriIntermediateResult,
        on_delete=models.CASCADE,
        db_column='rid'
    )

    class Meta:
        db_table = 'pycolibri_ir_statistic_item'
        verbose_name = 'Статистика замеров'
        verbose_name_plural = 'Статистика замеров'