# Лабораторная работа №3 — TravelPlan SPA на Vue.js

**Тема:** разработка одностраничного веб-приложения (SPA) с использованием Vue.js.  
**Приложение:** сервис подбора путешествий TravelPlan.  
**Выполнил:** Лапшин Максим.

## Что реализовано по ТЗ

|Требование|Реализация в проекте|
|-|-|
|Миграция приложения ЛР1/ЛР2 на Vue.js|Страницы прежнего TravelPlan перенесены в Vue Single-File Components (`.vue`)|
|SPA и роутер|`vue-router`: главная, карточка тура, кабинет, вход, регистрация, страница 404|
|Работа с внешним API через axios|`src/services/api.js`; GET `/tours`, GET `/filters`, GET `/tours/:id`, POST `/users`|
|Разумное деление на компоненты|`AppSidebar`, `ThemeToggle`, `TourFilters`, `TourCard`, `LoadingSpinner`, `SvgIcons`|
|Composable для повторяющейся функциональности|`useTheme`, `useAuth`, `useTours`, `useFavorites`, `useTravelNotes`|

## Функции приложения

* загрузка туров с локального REST API;
* фильтрация по направлению, типу отдыха, бюджету и длительности;
* отдельный маршрут с подробностями тура;
* избранные туры, тёмная тема и заметки с сохранением в `localStorage`;
* регистрация через POST-запрос к API;
* авторизация и защищённая страница личного кабинета;
* адаптивное боковое меню.

## Структура проекта

```text
TravelPlan\_LR3\_Vue/
├── api/
│   └── db.json                 # база данных JSON Server
├── public/                     # изображения туров
├── src/
│   ├── assets/main.css
│   ├── components/             # переиспользуемые компоненты
│   ├── composables/            # повторяемая логика Composition API
│   ├── router/index.js         # маршруты SPA и guard кабинета
│   ├── services/api.js         # axios-клиент и API-функции
│   ├── views/                  # страницы приложения
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## Запуск

Требуется **Node.js 20.19+** или **Node.js 22.12+**.

```bash
npm install
npm run dev:all
```

После запуска:

* приложение: `http://localhost:5173`
* REST API: `http://localhost:3001/tours`

Также можно запускать в двух терминалах:

```bash
npm run api
npm run dev
```

## Сборка для проверки

```bash
npm run build
npm run preview
```

