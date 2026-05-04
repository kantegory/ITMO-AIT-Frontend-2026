# Домашняя работа 5 — основы npm и Vue.js

Учебный мини-проект на Vue 3 + Vite, собранный для знакомства с пакетным менеджером
npm и базовыми концепциями фреймворка.

## Что было сделано

1. Установлен Node.js (`node --version`, `npm --version`).
2. С нуля инициализирован проект: создан `package.json`, описаны зависимости и скрипты.
3. Установлены пакеты `vue`, `vite`, `@vitejs/plugin-vue` через `npm install` (по записям в `package.json`).
4. Настроен Vite (`vite.config.js`) с плагином `@vitejs/plugin-vue`.
5. Реализовано приложение из трёх компонентов:
   - `App.vue` — корневой компонент;
   - `Counter.vue` — счётчик с шагом и удвоенным значением (демонстрация `ref`, `computed`, обработчиков событий);
   - `TodoList.vue` + `TodoItem.vue` — простой список дел (демонстрация `v-for`, `v-model`, props и пользовательских событий через `defineEmits`).

## Команды npm, которые освоены

| Команда | Что делает |
| --- | --- |
| `npm init -y` | создаёт `package.json` с дефолтами |
| `npm install <pkg>` | ставит пакет в `dependencies` |
| `npm install -D <pkg>` | ставит пакет в `devDependencies` |
| `npm install` | ставит все зависимости из `package.json` |
| `npm run <script>` | запускает скрипт из секции `scripts` |
| `npm run dev` | запуск Vite dev-сервера с HMR |
| `npm run build` | продакшн-сборка в `dist/` |
| `npm run preview` | локальный предпросмотр собранной версии |

## Концепции Vue, которые проработаны

- **Composition API + `<script setup>`** — компактная и типобезопасная запись логики.
- **Реактивность через `ref`** — простые значения, к которым обращаются как `.value` в JS и без него в шаблоне.
- **`computed`** — производные значения, пересчитываются автоматически при изменении зависимостей.
- **Декларативные шаблоны** — `v-bind`, `v-on` (`@click`), `v-model`, `v-for`, `v-if`.
- **Компонентный подход** — список дел разбит на родителя (`TodoList`) и дочерний компонент строки (`TodoItem`).
- **Props и события** — родитель передаёт данные через `defineProps`, дочерний компонент уведомляет об изменениях через `defineEmits('toggle', 'remove')`.

## Запуск

```bash
cd J3212/hw5
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Структура проекта

```
hw5/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.vue
    ├── main.js
    ├── styles.css
    └── components/
        ├── Counter.vue
        ├── TodoItem.vue
        └── TodoList.vue
```
