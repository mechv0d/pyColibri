from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone_code = models.CharField(max_length=3)
    phone_num = models.CharField(max_length=10, unique=True)

    # Отключаем неиспользуемые поля стандартной пользовательской модели
    username = None
    email = None

    USERNAME_FIELD = 'phone_num'
    REQUIRED_FIELDS = ['phone_code', 'first_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class Profile(models.Model):
    GENDER_CHOICES = [
        (True, 'Мужской'),
        (False, 'Женский'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    birthdate = models.DateField()
    height = models.PositiveIntegerField()  # в см
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # в кг
    gender = models.BooleanField(choices=GENDER_CHOICES)

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


class Dish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dishes')
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='dishes/', null=True, blank=True)
    description = models.TextField(blank=True)
    calories = models.PositiveIntegerField()  # ккал
    fats = models.DecimalField(max_digits=4, decimal_places=1)  # г
    proteins = models.DecimalField(max_digits=4, decimal_places=1)  # г
    carbohydrates = models.DecimalField(max_digits=4, decimal_places=1)  # г

    class Meta:
        verbose_name = 'Блюдо'
        verbose_name_plural = 'Блюда'
        ordering = ['name']


class Meal(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES)
    datetime = models.DateTimeField()
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Приём пищи'
        verbose_name_plural = 'Приёмы пищи'
        ordering = ['-datetime']


class Portion(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='portions')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    weight = models.PositiveIntegerField()  # в граммах

    class Meta:
        verbose_name = 'Порция'
        verbose_name_plural = 'Порции'


class WeightResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_results')
    date = models.DateField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # в кг

    class Meta:
        verbose_name = 'Замер веса'
        verbose_name_plural = 'Замеры веса'
        ordering = ['-date']
        unique_together = ['user', 'date']


class Feedback(models.Model):
    STATUS_CHOICES = [
        (0, 'Новое'),
        (1, 'В обработке'),
        (2, 'Решено'),
        (3, 'Отклонено'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    email = models.EmailField()
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    class Meta:
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратная связь'
        ordering = ['-sent_at']


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    photo = models.ImageField(upload_to='blog/', null=True, blank=True)
    url = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Запись блога'
        verbose_name_plural = 'Записи блога'
        ordering = ['-created_at']