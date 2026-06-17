# Домашняя работа 5 (вариант 4)

Тема: изучение npm и базового старта проекта на Vue.

## Что сделано

- Создан отдельный проект на Vue 3 с использованием Vite.
- Настроены npm-скрипты:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Реализован компонентный подход на простом учебном приложении:
  - `NavbarTop.vue`
  - `ProgressPanel.vue`
  - `CourseCard.vue`
- Собран корневой компонент `App.vue`, который использует перечисленные компоненты.

## Структура

- `package.json`, `vite.config.js`, `index.html`
- `src/main.js`
- `src/App.vue`
- `src/components/*`
- `src/assets/main.css`

## Запуск

1. Перейти в директорию:
   ```bash
   cd "J3210/Павлов Арсений/homeworks/hw5"
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Запустить dev-сервер:
   ```bash
   npm run dev
   ```
4. Проверить production-сборку:
   ```bash
   npm run build
   ```
