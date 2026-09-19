# ЛР2 — запуск мок-API и фронтенда

## Установка

```bash
cd labs/lab2
npm install
```

## Запуск (два терминала)

```bash
# Терминал 1 — мок-API с авторизацией на http://localhost:3000
npm run api

# Терминал 2 — статика фронтенда на http://localhost:5173
npm run serve
```

Открыть http://localhost:5173.

## Как устроена авторизация

Используется `json-server-auth`:

- `POST /register` — `{ email, password, name }` → `{ accessToken, user }`
- `POST /login` — `{ email, password }` → `{ accessToken, user }`
- защищённые ресурсы запрашиваются с заголовком `Authorization: Bearer <token>`

Токен и пользователь сохраняются в `localStorage` (см. `js/auth.js`).

## Файлы

- `db.json` — данные мок-API (users, accounts, transactions, budgets, categories)
- `js/api.js` — обёртка над `fetch` + методы для сущностей
- `js/auth.js` — register / login / logout / requireAuth
- `js/main.js` — связывание страниц с API (вход, регистрация, список транзакций)

## Что доделать

- [ ] Привязать форму фильтров на `search.html` к query-параметрам json-server
- [ ] Отрисовать счета/бюджеты/транзакции в `dashboard.html` из API
- [ ] Реализовать добавление транзакции (POST) из модального окна
- [ ] (опц.) Заменить `fetch` на `axios`
