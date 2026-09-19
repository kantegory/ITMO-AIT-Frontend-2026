# Лабораторная работа 3

Тема: миграция платформы онлайн-курсов **Omagad** на Vue SPA.

## Что реализовано

- Vue 3 SPA, собранная через Vite.
- Vue Router с маршрутами:
  - `/` - каталог и фильтрация курсов;
  - `/courses/:id` - страница курса;
  - `/login` - вход;
  - `/register` - регистрация;
  - `/profile` - личный кабинет пользователя;
  - `/teacher` - кабинет преподавателя.
- Navigation guard для защищённых страниц `/profile` и `/teacher`.
- Работа с mock API через `axios`.
- Mock API на `json-server-auth`.
- Composable:
  - `useAuth` - токен, пользователь, вход, регистрация, выход;
  - `useCourses` - курсы, записи пользователя, запись на курс, статистика.
- Компоненты:
  - `AppHeader`;
  - `CourseFilters`;
  - `CourseCard`;
  - `MetricGrid`;
  - `StateNotice`.

## Тестовые пользователи

```txt
student@omagad.ru / password123
teacher@omagad.ru / password123
```

## Команды

```bash
npm install
npm run api
npm run web
npm run build
```

Одновременно API и фронтенд:

```bash
npm run dev
```

После запуска:

- frontend: `http://127.0.0.1:5175/`;
- API: `http://127.0.0.1:3002/`.

## Где находится код

- `src/router/index.js` - маршрутизация и guard;
- `src/services/api.js` - axios instance;
- `src/composables/useAuth.js` - авторизация;
- `src/composables/useCourses.js` - работа с курсами;
- `src/views` - страницы приложения;
- `src/components` - переиспользуемые компоненты;
- `db.json` и `routes.json` - mock API.
