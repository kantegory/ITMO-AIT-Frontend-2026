# AI Hub

Социальная платформа для обмена моделями и датасетами

## Запуск

Нужно два терминала.

Терминал 1 — API (json-server):
```bash
cd путь/до/lab2
npx json-server db.json
```
Сервер поднимается на `http://localhost:3000`.

Терминал 2 — фронтенд:
```bash
cd путь/до/lab2
npx serve -l 5500
```
Открыть `http://localhost:5500`.

## Тестовый аккаунт

| Email | Пароль |
|---|---|
| demo@example.com | password123 |

## Структура

```
lab2/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js       # fetch-обёртки для работы с json-server
│       ├── auth.js      # логика входа и регистрации
│       ├── search.js    # загрузка и фильтрация карточек на странице поиска
│       ├── ui.js        # динамический navbar, route guard
│       └── main.js      # UI-интеракции (star/fork, фильтр, скролл)
├── pages/
│   ├── auth/
│   │   ├── login.html
│   │   └── register.html
│   ├── dashboard/
│   │   └── dashboard.html
│   └── data/
│       ├── dataset.html
│       ├── model.html
│       └── search.html
├── db.json              # база данных для json-server
├── index.html
└── README.md
```
