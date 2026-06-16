# Домашняя работа 5: npm и старт проекта на Vue

## Контекст

npm используется в проекте с ЛР2: выбор TypeScript автоматически потребовал сборщика (Vite) и пакетного менеджера. К ДЗ5 `package.json` уже содержит зависимости, а скрипты гоняются ежедневно — поэтому ниже разбираю именно то, что реально применяется в проекте.

## Основные команды npm

### Инициализация

```bash
npm init -y          # создаёт package.json с дефолтами
```

В проекте `package.json` создавался вручную и дополнялся по мере добавления зависимостей.

### Установка пакетов

```bash
npm install                        # восстановить node_modules по package-lock.json
npm install vue vue-router axios   # добавить в dependencies
npm install -D vite @vitejs/plugin-vue vue-tsc typescript  # добавить в devDependencies
```

Флаг `-D` (или `--save-dev`) помещает пакет в `devDependencies` — он нужен только при разработке и не попадает в продакшен-бандл.

### Запуск скриптов

```bash
npm run dev       # vite — дев-сервер с HMR на http://localhost:5173
npm run build     # vue-tsc --noEmit && vite build — тайпчек + прод-сборка
npm run api       # json-server-auth — моковый REST API на :3000
npm run preview   # vite preview — предпросмотр прод-сборки локально
```

Скрипты объявлены в `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "typecheck": "vue-tsc --noEmit",
  "preview": "vite preview",
  "api": "json-server-auth server/db.json --routes server/routes.json --port 3000"
}
```

### Версионирование

В `package.json` все зависимости указаны с `^` — это разрешает минорные и патч-обновления, но блокирует мажорную версию. `package-lock.json` фиксирует точные версии, гарантируя воспроизводимость сборки на любой машине.

## Зависимости проекта

```json
"dependencies": {
  "axios":      "^1.7.7",    // HTTP-клиент с interceptors
  "vue":        "^3.5.13",   // фреймворк
  "vue-router": "^4.4.5"    // клиентская маршрутизация
},
"devDependencies": {
  "vite":                "^5.4.8",   // сборщик + дев-сервер
  "@vitejs/plugin-vue":  "^5.2.0",   // поддержка .vue SFC в Vite
  "vue-tsc":             "^2.1.10",  // tsc для Vue-файлов
  "typescript":          "^5.5.4",
  "json-server":         "^0.17.4",  // мок-бэкенд
  "json-server-auth":    "^2.1.0",   // JWT поверх json-server
  "@types/node":         "^20.19.41"
}
```

## Vue-приложение

Проект в ЛР3 — полноценный SPA на Vue 3 (Composition API, `<script setup>`), мигрированный со статического multi-page сайта (ЛР1 + ЛР2).

### Точка входа

```ts
// src/main.ts
import { createApp } from 'vue'
import { router }    from './router'
import App           from './App.vue'

createApp(App).use(router).mount('#app')
```

### Маршруты

```ts
// src/router/index.ts
const routes = [
  { path: '/',          name: 'login',     component: () => import('../views/LoginView.vue'),    meta: { guestOnly: true } },
  { path: '/register',  name: 'register',  component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'),meta: { requiresAuth: true } },
  { path: '/search',    name: 'search',    component: () => import('../views/SearchView.vue'),   meta: { requiresAuth: true } },
  { path: '/tasks/:id', name: 'task',      component: () => import('../views/TaskView.vue'),     meta: { requiresAuth: true }, props: true },
]
```

Все view-чанки lazy — Vite собирает их отдельно, пользователь загружает только нужный.

### Компоненты (15 SFC)

| Группа | Компоненты |
| --- | --- |
| Оболочка | `AppShell`, `AppSidebar`, `AppTopbar` |
| Утилиты | `SvgIcon`, `ThemeToggle`, `PasswordInput`, `LabNav` |
| Бейджи | `StatusBadge`, `PriorityBadge` |
| Списки | `TaskRow`, `TaskCard`, `StatCard`, `ProjectItem`, `ActivityItem`, `SubtaskItem` |

### Composables (4 штуки)

| Composable | Что делает |
| --- | --- |
| `useAuth` | реактивный `user`, `login`, `logout`, `isAuthenticated` |
| `useTheme` | читает/пишет `localStorage`, слушает `prefers-color-scheme` |
| `useAsync<T>` | паттерн `loading / error / data` для API-вызовов |
| `useDebouncedRef` | `customRef` с `setTimeout` — дебаунс для поиска |

### Views (5 страниц)

- **LoginView / RegisterView** — формы с `PasswordInput`, axios-вызов `login()`/`register()`.
- **DashboardView** — `Promise.all` для трёх API, `computed`-агрегаты статистики.
- **SearchView** — реактивные фильтры + дебаунсированный `watch` через `useDebouncedRef`.
- **TaskView** — optimistic UI при смене статуса (PATCH + откат по ошибке), параметр `id` из `props: true`.

## Сборка

```bash
npx vue-tsc --noEmit   # 0 ошибок
npx vite build
# dist/index.html + lazy chunks:
#   LoginView-…js    3.65 kB gzip
#   TaskView-…js     8.25 kB gzip
#   index-…js (рантайм + общий код) ~55 kB gzip
```

## Запуск

```bash
npm install
npm run api   # :3000
npm run dev   # :5173
# демо: demo@taskerai.app / demo1234
```

## Итог

npm-скрипты полностью покрывают рабочий процесс: `dev` для разработки, `build` для продакшена, `api` для мока. Зависимости разделены на `dependencies` (runtime) и `devDependencies` (только сборка). Vue-приложение — полноценный SPA: роутер с навигационным гардом, 15 SFC-компонентов, 4 composable, axios-слой с interceptors.
