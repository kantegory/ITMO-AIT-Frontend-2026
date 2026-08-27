# Project Manager

Веб-приложение для управления проектами с регистрацией, командной работой и обсуждением задач.

## Возможности

- Регистрация и вход пользователей
- Просмотр списка проектов с фильтрацией и поиском
- Роли участников проекта
- Загрузка и удаление файлов проекта
- Обсуждение проектов (комментарии)

## Технологии

| Компонент | Технология |
|-----------|-----------|
| Фронтенд | HTML5, CSS3, Vanilla JavaScript (ES6+ Modules) |
| Стили | Bootstrap 5.3 + кастомные стили |
| Бэкенд | json-server 0.17.x |
| Сервер | Python http.server (фронтенд) + Node.js (бэкенд) |
| Хранение данных | Локальный файл db.json |

## Структура проекта

project-manager/
├── README.txt
├── index.html
├── register.html
├── login.html
├── personal_account.html
├── project.html
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── register.js
│   ├── login.js
│   ├── personal_account.js
│   └── project.js
└── server/
    ├── package.json
    ├── server.js
    └── db.json

## Запуск

1. Установка зависимостей бэкенда
Из корня проекта:
cd server
npm install
cd ..

2. Запуск двух серверов (в разных терминалах)
Важно: Оба сервера должны работать одновременно.

Терминал 1: Бэкенд (порт 3001)
cd server
npm start
Ожидаемый результат: Сервер запущен на http://localhost:3001

Терминал 2: Фронтенд (порт 5500)
Из корня проекта (не закрывая первый терминал):
py -m http.server 5500
или
python -m http.server 5500
или
python3 -m http.server 5500
Ожидаемый результат: Serving HTTP on :: port 5500 ...

3. Открытие приложения
Перейти в браузере по адресу: http://localhost:5500/index.html

## API Эндпоинты

Бэкенд предоставляет стандартный REST API на основе json-server:

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | /projects | Получить все проекты |
| GET | /projects/:id | Получить проект по ID |
| POST | /projects | Создать новый проект |
| PATCH | /projects/:id | Обновить проект |
| DELETE | /projects/:id | Удалить проект |
| GET | /files?projectId=1 | Получить файлы проекта |
| POST | /files | Загрузить файл |
| DELETE | /files/:id | Удалить файл |
| GET | /comments?projectId=1 | Получить комментарии |
| POST | /comments | Добавить комментарий |
| GET | /users?email=... | Найти пользователя по email |
| POST | /users | Создать пользователя (регистрация) |