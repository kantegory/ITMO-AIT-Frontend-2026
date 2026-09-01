# Домашняя работа № 5 — Vue 3 и npm

Одностраничная Vue-версия личного кабинета «Т‑Пульс», продолжающая проект из предыдущих домашних работ.

## Запуск проекта

```bash
npm install
npm run dev
```

Vite выведет локальный адрес приложения в терминале.

## Production-сборка

```bash
npm run build
npm run preview
```

Команда `npm run build` создаёт оптимизированную сборку в каталоге `dist`.

## Использованные команды npm

```bash
npm create vite@latest . -- --template vue
npm install
npm install @lucide/vue
npm run dev
npm run build
npm run preview
```

## Компоненты

- `App.vue` — корневой компонент и реактивное состояние dashboard;
- `AppSidebar.vue` — боковая навигация и рабочее пространство;
- `AppTopbar.vue` — верхняя панель, тема, поиск и действия;
- `StatsGrid.vue` — вычисляемая статистика задач;
- `ProjectGrid.vue` — карточки активных проектов;
- `TodayTasks.vue` — реактивный список задач;
- `ActivityFeed.vue` — последняя активность команды;
- `NotificationsDrawer.vue` — панель уведомлений;
- `NewTaskModal.vue` — форма создания задачи с `v-model`.

## Возможности приложения

- добавление новой задачи через Vue-форму;
- завершение и возврат задач в работу;
- автоматический пересчёт статистики через `computed`;
- поиск по задачам;
- панель уведомлений и отметка событий прочитанными;
- светлая и тёмная темы;
- сохранение задач и темы в `localStorage`;
- адаптивная вёрстка для desktop, tablet и mobile.

## Применённые возможности Vue

В проекте используются Single-File Components, Composition API, `<script setup>`, `ref`, `computed`, `watch`, `v-model`, `v-for`, `v-if`, `Transition`, `Teleport`, динамические классы, `props` и пользовательские события `emit`.

Иконки подключены как npm-зависимость `@lucide/vue`.
