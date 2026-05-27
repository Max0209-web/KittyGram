from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Cat(models.Model):
    STATUS_CHOICES = [
        ('lost', 'Потерян'),
        ('found', 'Найден'),
        ('returned', 'Вернулся домой'),
    ]

    name = models.CharField(max_length=16, verbose_name='Имя')
    color = models.CharField(max_length=16, verbose_name='Цвет')
    birth_year = models.IntegerField(
        verbose_name='Год рождения',
        validators=[
            MaxValueValidator(2026, message='Год рождения не может быть позже текущего')
        ]
    )
    owner = models.ForeignKey(
        User,
        related_name='cats',
        on_delete=models.CASCADE,
        verbose_name='Владелец'
    )
    image = models.ImageField(
        upload_to='cats/images/',
        null=True,
        blank=True,
        default=None,
        verbose_name='Фотография'
    )
    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default='lost',
        verbose_name='Статус объявления'
    )
    last_seen_place = models.CharField(
        max_length=120,
        default='Район не указан',
        verbose_name='Где видели'
    )
    contact = models.CharField(
        max_length=120,
        default='Контакт не указан',
        verbose_name='Контакт для связи'
    )
    description = models.TextField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='Описание'
    )

    class Meta:
        verbose_name = 'Котик'
        verbose_name_plural = 'Котики'
        ordering = ['-id']

    def __str__(self):
        return self.name


class Collection(models.Model):

    CATEGORY_CHOICES = [
        ('lost', 'Потерянные'),
        ('found', 'Найденные'),
        ('urgent', 'Срочные'),
        ('district', 'По району'),
        ('returned', 'Вернулись домой'),
        ('other', 'Другие'),
    ]

    name = models.CharField(max_length=64, verbose_name='Название группы поиска')
    description = models.TextField(max_length=500, blank=True, verbose_name='Описание')
    category = models.CharField(
        max_length=32,
        choices=CATEGORY_CHOICES,
        default='other',
        verbose_name='Категория'
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='collections',
        verbose_name='Владелец'
    )
    cats = models.ManyToManyField(
        Cat,
        related_name='collections',
        blank=True,
        verbose_name='Котики в группе поиска'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    views_count = models.PositiveIntegerField(default=0, verbose_name='Просмотры')
    likes = models.ManyToManyField(
        User,
        related_name='liked_collections',
        blank=True,
        verbose_name='Лайки'
    )

    class Meta:
        verbose_name = 'Группа поиска'
        verbose_name_plural = 'Группы поиска'
        ordering = ['-views_count', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    def like_count(self):
        return self.likes.count()
