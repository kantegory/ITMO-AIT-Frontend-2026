# ProjectHub — ЛР3 (Vue.js SPA)

Миграция приложения для управления проектами с HTML/JS на Vue.js 3 + Vite.

## Стек

- Vue 3 (Composition API, `<script setup>`)
- Vue Router 4 (с navigation guards и meta)
- Axios для работы с API
- Bootstrap 5 для стилей и компонентов
- json-server в качестве мокового API
- Vite в качестве сборщика и dev-сервера

## Структура

```
src/
  api/          axios-клиент и обёртки над эндпоинтами
  composables/  переиспользуемая логика (useAuth, useI18n, useUsers)
  components/   UI-компоненты (Navbar, карточки, модалки)
  views/        страницы под маршруты роутера
  router/       конфигурация маршрутов и navigation guards
  assets/       глобальные стили
api/db.json     состояние мокового API
server.js       mock API с авторизацией через JWT-подобный токен
```

## Запуск

```bash
npm install
npm run api      # mock API на http://localhost:3000
npm run dev      # фронт на http://localhost:5173
```

Тестовый аккаунт: `ivan@example.com` / `123456`.
