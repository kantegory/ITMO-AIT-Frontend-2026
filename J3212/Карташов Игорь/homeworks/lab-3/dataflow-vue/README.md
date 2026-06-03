# DataFlow — Lab 3 (Vue SPA)

Миграция приложения DataFlow (ЛР1/ЛР2) на Vue 3 с Vue Router и axios.

## Запуск

```bash
npm install
npm run api    # json-server на http://localhost:3000
npm run dev    # Vite dev server на http://localhost:5173
```

## Тестовый аккаунт

- Email: `igor@company.com`
- Password: `admin123`

## Структура

- `src/router` — маршрутизация (login, register, pipelines, detail, profile)
- `src/api` — axios-клиент и методы API
- `src/composables` — `useAuth`, `useTheme`, `useStatus`
- `src/components` — переиспользуемые UI-компоненты
- `src/views` — страницы SPA
