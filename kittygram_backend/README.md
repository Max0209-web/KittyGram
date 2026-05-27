# Kittygram Lost Cats - REST API

Бэкенд сервиса Kittygram Lost Cats: объявления о потерянных и найденных котах. Проект построен на Django REST Framework, использует токен-аутентификацию Djoser, хранит фотографии через Pillow и запускается локально или через Docker.

## Технологии

| Технология | Назначение |
|------------|------------|
| Python 3.11+ | Язык программирования |
| Django 5.2 | Веб-фреймворк |
| Django REST Framework | REST API |
| Djoser | Регистрация и токен-аутентификация |
| SQLite | Файловая база данных |
| Pillow | Загрузка изображений |
| Docker | Контейнеризация |

## Структура проекта

```
kittygram_backend/
├── cats/                       # приложение объявлений
│   ├── models.py               # Cat, Collection
│   ├── serializers.py          # сериализация JSON
│   ├── views.py                # ViewSet и фильтрация
│   ├── permissions.py          # IsOwnerOrAdminOrReadOnly
│   └── migrations/
├── kittygram_backend/          # настройки Django
├── media/                      # фотографии объявлений
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── schema.yaml
└── kittygram_collection.json
```

## Локальный запуск

```bash
cd kittygram_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API будет доступен на `http://127.0.0.1:8000/`, админка - на `http://127.0.0.1:8000/admin/`.

## Запуск через Docker

```bash
docker-compose up --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
curl http://localhost:8000/api/cats/
docker-compose down
```

`Dockerfile` собирает backend-образ на базе `python:3.11-slim`, устанавливает системные зависимости, ставит пакеты из `requirements.txt`, копирует код, применяет миграции, собирает статику и запускает Django на порту 8000.

`docker-compose.yml` запускает сервис `backend`, пробрасывает порт `8000:8000`, подключает переменные из `.env`, а также тома `./media:/app/media` и `./staticfiles:/app/staticfiles`.

## Переменные окружения

Настоящий `SECRET_KEY` не публикуется. В репозитории хранится только шаблон `.env.example`:

| Переменная | Назначение | Пример |
|------------|------------|--------|
| `SECRET_KEY` | Секретный ключ Django | `django-insecure-change-me-in-production` |
| `DEBUG` | Режим отладки | `True` |
| `ALLOWED_HOSTS` | Разрешённые хосты через запятую | `localhost,127.0.0.1` |

## Эндпоинты

Базовый URL: `http://127.0.0.1:8000`

### Аутентификация

| Метод | URL | Назначение |
|-------|-----|------------|
| POST | `/api/users/` | Регистрация пользователя |
| POST | `/api/token/login/` | Получение токена |
| POST | `/api/token/logout/` | Выход по токену |
| GET | `/api/users/me/` | Профиль текущего пользователя |

### Объявления о котах

| Метод | URL | Назначение | Права |
|-------|-----|------------|-------|
| GET | `/api/cats/?page=N` | Список объявлений | Любой |
| GET | `/api/cats/?status=lost` | Фильтр по статусу | Любой |
| GET | `/api/cats/?place=Сокол` | Фильтр по месту | Любой |
| POST | `/api/cats/` | Создать объявление | Авторизованный |
| GET | `/api/cats/{id}/` | Детали объявления | Любой |
| PATCH | `/api/cats/{id}/` | Обновить объявление | Владелец или администратор |
| DELETE | `/api/cats/{id}/` | Удалить объявление | Владелец или администратор |

Пример создания объявления:

```json
{
  "name": "Марта",
  "color": "#FF8C00",
  "birth_year": 2021,
  "status": "lost",
  "last_seen_place": "район Сокол, у метро",
  "contact": "+7 900 111-22-33",
  "description": "Рыжая кошка, зелёный ошейник, боится шума",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZ..."
}
```

Допустимые статусы: `lost`, `found`, `returned`.

### Группы поиска

| Метод | URL | Назначение | Права |
|-------|-----|------------|-------|
| GET | `/api/collections/` | Список групп | Любой |
| POST | `/api/collections/` | Создать группу | Авторизованный |
| GET | `/api/collections/{id}/` | Детали группы | Любой |
| PATCH | `/api/collections/{id}/` | Обновить группу | Владелец или администратор |
| DELETE | `/api/collections/{id}/` | Удалить группу | Владелец или администратор |
| POST | `/api/collections/{id}/add_cat/` | Добавить объявление в группу | Владелец группы |
| POST | `/api/collections/{id}/remove_cat/` | Убрать объявление из группы | Владелец группы |

Категории групп: `lost`, `found`, `urgent`, `district`, `returned`, `other`.

## Права доступа

Права реализованы через `IsOwnerOrAdminOrReadOnly` и `IsAuthenticatedOrReadOnly`.

Безопасные методы `GET`, `HEAD`, `OPTIONS` доступны всем, включая гостей без токена. Создание требует токен. Изменение и удаление разрешены только владельцу объекта или администратору.

## Валидация

`birth_year` не может быть больше текущего года. `status` должен быть одним из допустимых статусов. `category` должна входить в список категорий групп поиска. Цвет передаётся hex-значением и преобразуется через `webcolors`.

## Postman

Файл `kittygram_collection.json` содержит рабочие запросы: регистрацию, получение токена, создание объявления, список объявлений, создание группы, добавление объявления в группу, фильтрацию и отрицательные кейсы.

## API-документация

OpenAPI 3.0 схема находится в `schema.yaml`.

Открыть схему можно двумя способами:

1. Swagger Editor: перейти на `https://editor.swagger.io/`, выбрать `File -> Import file` и загрузить `schema.yaml`.
2. Redoc: выполнить `npx @redocly/cli preview-docs schema.yaml` из папки `kittygram_backend`.
