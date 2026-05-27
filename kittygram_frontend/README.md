## Технологии
- Python 3.11
- Django 5.2
- Django REST Framework
- Djoser (аутентификация)
- SQLite
- Docker

## Установка и запуск
### Локальный запуск

```bash

git clone <ссылка_на_репозиторий>
cd kittygram_backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # для Mac/Linux

# Установить зависимости
pip install -r requirements.txt

# Применить миграции
python manage.py migrate

# Запустить сервер
python manage.py runserver
```
### Запуск через Docker
```bash
# Собрать и запустить контейнер
docker-compose up --build
```
После запуска API будет доступен по адресу: `http://localhost:8000/api/`

## API Эндпоинты
| Метод | URL | Назначение | Права доступа |
|-------|-----|------------|---------------|
| POST | `/api/users/` | Регистрация нового пользователя | Любой |
| POST | `/api/token/login/` | Получение токена аутентификации | Любой |
| POST | `/api/token/logout/` | Выход из системы | Авторизованный |
| GET | `/api/cats/` | Получение списка всех котиков | Только авторизованный |
| POST | `/api/cats/` | Создание нового котика | Только авторизованный |
| GET | `/api/cats/{id}/` | Получение деталей котика | Только авторизованный |
| PUT | `/api/cats/{id}/` | Редактирование котика | Только владелец |
| DELETE | `/api/cats/{id}/` | Удаление котика | Только владелец |
| GET | `/api/collections/` | Получение списка всех подборок | Любой |
| POST | `/api/collections/` | Создание новой подборки | Только авторизованный |
| GET | `/api/collections/{id}/` | Получение деталей подборки | Любой |
| PUT | `/api/collections/{id}/` | Редактирование подборки | Только владелец |
| DELETE | `/api/collections/{id}/` | Удаление подборки | Только владелец |
| POST | `/api/collections/{id}/add_cat/` | Добавить котика в подборку | Только владелец |
| POST | `/api/collections/{id}/remove_cat/` | Удалить котика из подборки | Только владелец |
| POST | `/api/collections/{id}/like/` | Поставить лайк подборке | Только авторизованный |
| POST | `/api/collections/{id}/unlike/` | Убрать лайк с подборки | Только авторизованный |
| GET | `/api/collections/{id}/cats_paginated/` | Пагинированный список котиков в подборке | Любой |

## Примеры запросов
### 1. Регистрация пользователя
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{"username": "kotik_lover", "password": "qwerty123"}'
```
**Ответ:**
```json
{
  "username": "kotik_lover",
  "id": 1
}
```
### 2. Получение токена
```bash
curl -X POST http://localhost:8000/api/token/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "kotik_lover", "password": "qwerty123"}'
```
**Ответ:**
```json
{
  "auth_token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```
### 3. Создание котика (с токеном)

```bash
curl -X POST http://localhost:8000/api/cats/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{"name": "Барсик", "color": "#FF0000", "birth_year": 2020}'
```
**Ответ:**
```json
{
  "id": 1,
  "name": "Барсик",
  "color": "red",
  "birth_year": 2020,
  "owner": 1,
  "owner_username": "kotik_lover",
  "age": 6,
  "image": null
}
```
### 4. Получение списка подборок (без токена)
```bash
curl -X GET http://localhost:8000/api/collections/
```

**Ответ:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [...]
}
```
### 5. Создание подборки

```bash
curl -X POST http://localhost:8000/api/collections/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{"name": "Самые милые котики", "description": "Только милота", "category": "cute"}'
```
### 6. Добавление котика в подборку

```bash
curl -X POST http://localhost:8000/api/collections/1/add_cat/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{"cat_id": 1}'
```
### 7. Постановка лайка

```bash
curl -X POST http://localhost:8000/api/collections/1/like/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
```
### 8. Получение топ-5 популярных подборок

```bash
curl -X GET http://localhost:8000/api/collections/popular/
```
## Фильтрация и пагинация
### Фильтрация по категории
```bash
GET /api/collections/?category=cute
```
### Пагинация
```bash
GET /api/collections/?page=2
```
## Структура проекта

```
kittygram_backend/
├── cats/
├── kittygram_backend/
├── media/
├── staticfiles/
├── venv
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── manage.py
└── requirements.txt
## Автор
Васильева Кира Дмитриевна, РЭУ им. Г.В. Плеханова, 2026