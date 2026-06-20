# Защита ЛР3 — TripPlanner на Vue (тезисы)

Студент: **Тиуков Даниил**, J3213
Проект: `labs/lab-3/travel-planner`

---

## Кратко о проекте

ЛР3 — миграция приложения TripPlanner из ЛР2 на фреймворк **Vue 3**. В ЛР2 был многостраничный сайт на ванильном JS+Bootstrap. В ЛР3 я переписал его как **SPA**: одно `index.html`, маршрутизация на клиенте, страницы — Vue-компоненты, общий код вынесен в **composables**.

Бэкенд — **тот же `json-server`** с теми же 10 коллекциями. Менялась только клиентская часть.

Стек ЛР3: Vue 3 (Composition API + `<script setup>`), vue-router 4, axios, Vite, Bootstrap 5, json-server.

---

## 1. Сборка на Vite + структура SPA

Проект собирается через **Vite** (`@vitejs/plugin-vue`).

`src/main.js` — единственная точка входа: импортирует Bootstrap CSS+JS, мою стилизацию, корневой компонент `App.vue` и роутер, монтирует приложение в `#app`.

```js
createApp(App).use(router).mount('#app')
```

Скрипты в `package.json`:
- `npm run dev` — Vite dev-сервер с HMR
- `npm run server` — json-server :3000
- `npm run start` — оба сразу через `concurrently` (один параллельный процесс)
- `npm run build` — продакшен-сборка

**Зачем:** в ЛР2 страницы перезагружались целиком. Тут одна страница, рендер компонентов на клиенте, HMR в разработке.

---

## 2. vue-router — клиентская маршрутизация

Файл `src/router/index.js`. 8 маршрутов:

| Путь | Компонент | Доступ |
|---|---|---|
| `/` | HomeView | все |
| `/destinations` | DestinationsView | все |
| `/destinations/:id` | DestinationDetailsView | все |
| `/login` | LoginView | только гости (`guestOnly`) |
| `/register` | RegisterView | только гости |
| `/dashboard` | DashboardView | требует auth (`requiresAuth`) |
| `/collaboration` | CollaborationView | требует auth |
| `/:pathMatch(.*)*` | NotFoundView | 404 |

Использую **`createWebHashHistory()`** (URL вида `#/dashboard`) — работает без серверной настройки fallback на index.html. Все компоненты загружаются **лениво** (`() => import(...)`) — code splitting.

**Auth-guard** через `router.beforeEach`:
- если страница `requiresAuth`, а пользователь не залогинен → редирект на `/login?redirect=<куда хотел>`
- если страница `guestOnly`, а уже залогинен → редирект в `/dashboard`

В `router.afterEach` подставляю заголовок вкладки из `meta.title`.

**Зачем:** в ЛР2 защита страниц была хаком — JS на странице после загрузки кидал на login. Тут защита **до** монтирования компонента, на уровне роутера.

---

## 3. HTTP — axios

Заменил `fetch` на **axios**:

`src/api/httpClient.js` — единый axios-инстанс:
```js
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
})
```

Response-interceptor централизованно логирует ошибки.

`src/api/travelApi.js` — объект `TravelApi` с именованными методами (как и в ЛР2, но через axios): `findUserByEmail`, `findUserByCredentials`, `registerUser`, `updateUser`, `getDestinations`, `getDestination`, `getReviews`, `addReview`, `getRoutes`/`addRoute`/`updateRoute`/`deleteRoute`, аналогично для notes, favorites, participants, stages, shared-notes, ideas — всего ~30 методов.

**Зачем axios вместо fetch:**
- автоматический парсинг JSON и сериализация params в query-string
- интерцепторы для глобальной обработки ошибок и таймаута
- `baseURL` задаётся один раз, не дублируется
- более короткий API: `apiClient.get('/users', { params: { email } })` вместо ручной сборки URL

---

## 4. Composables — переиспользуемая логика

Главное архитектурное отличие от ЛР2. Вынес повторяющуюся логику в `src/composables/`:

| Composable | Что инкапсулирует |
|---|---|
| `useStorage` | реактивный `ref`, синхронизированный с `localStorage` (с кешем и подпиской на событие `storage`) |
| `useAuth` | `currentUser`, `isAuthenticated`, `register`, `login`, `logout`, `updateProfile` |
| `useTheme` | переключение светлой/тёмной темы + системная `prefers-color-scheme` |
| `useToast` | реактивный массив тостов + методы `showToast`/`removeToast` |
| `useFavorites` | загрузка избранного, `isFavorite`, `add`, `remove` |
| `useRoutes` | CRUD по маршрутам пользователя |
| `useNotes` | CRUD по заметкам |
| `useReviews` | список отзывов и добавление |
| `useCollaboration` | участники, этапы, общие заметки, идеи и голоса |
| `useDestinations` | загрузка каталога + словари ярлыков (type/budget/duration) |
| `useDestinationFilters` | состояние фильтров, видимая страница, пагинация, сортировка |

Пример — `useAuth`:
```js
const currentUser = useStorage(STORAGE_KEYS.currentUser, null)
const isAuthenticated = computed(() => Boolean(currentUser.value))
```

`currentUser` — реактивная ссылка на пользователя в `localStorage`. При логине/логауте автоматически обновляются navbar, guards и все страницы, которые читают `isAuthenticated`.

**Зачем:** в ЛР2 я в каждом `js/<страница>.js` руками читал localStorage и звал API. В Vue это объединено в одну функцию: компонент пишет `const { isFavorite, add } = useFavorites()` — и получает реактивное состояние + готовые методы.

---

## 5. Компоненты

Разбил приложение на компоненты:

**Общие** (`src/components/`):
- `AppNavbar.vue` — шапка с навигацией, переключатель темы, имя пользователя/кнопки входа
- `AppFooter.vue` — подвал
- `DestinationCard.vue` — карточка направления в каталоге (входы: `destination`, `isFavorite`; выход: `@save`)
- `ToastContainer.vue` — рендерит тосты из `useToast`

**Страницы** (`src/views/`): `HomeView`, `DestinationsView`, `DestinationDetailsView`, `LoginView`, `RegisterView`, `DashboardView`, `CollaborationView`, `NotFoundView`.

В `App.vue` всё это собирается:
```vue
<AppNavbar />
<main id="main-content"><RouterView /></main>
<AppFooter />
<ToastContainer />
```

**Зачем:** карточка направления одинаково выглядит на главной, в каталоге и в избранном — раньше я дублировал HTML, теперь это один компонент с пропсами.

---

## 6. Реактивность и Composition API

Везде использую `<script setup>` + Composition API. Типичный паттерн:

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites.js'

const { isFavorite, add, loadFavorites } = useFavorites()
onMounted(loadFavorites)
</script>
```

Преимущества над Options API:
- логика группируется по фиче, а не разбросана по `data`/`methods`/`computed`
- легко вынести в composable и переиспользовать
- меньше boilerplate (`<script setup>` сам экспортирует имена в шаблон)

---

## 7. Темы — `useTheme`

Логика та же, что в ЛР2 (выбор + `prefers-color-scheme`), но обёрнута в composable. Компонент navbar пишет:
```js
const { theme, toggleTheme } = useTheme()
```

Тема пишется на `<html data-theme="dark|light">`, в CSS на это атрибут навешаны переменные. При загрузке тема ставится сразу из localStorage, без мигания.

---

## 8. Что осталось от ЛР2 без изменений

- `db.json` — тот же, 10 коллекций
- json-server, порт 3000, REST-семантика
- логика регистрации/входа: `GET /users?email=` для проверки, `POST /users` для создания
- стилизация (`src/assets/style.css` — портирована из ЛР2)
- картинки направлений (8 JPG в `public/images/`)
- бизнес-логика фильтров каталога

Менялось **как** клиент общается с сервером и **как** организован клиентский код — не сами данные и не визуальный дизайн.

---

## 9. Структура проекта

```
travel-planner/
├── index.html                  shell SPA (только <div id="app">)
├── vite.config.js              alias '@' → src/
├── package.json                скрипты dev/server/start/build
├── db.json                     те же 10 коллекций из ЛР2
├── public/
│   └── images/*.jpg            8 фото направлений
└── src/
    ├── main.js                 точка входа
    ├── App.vue                 корневой компонент (navbar + RouterView + footer)
    ├── router/index.js         8 маршрутов + guards
    ├── api/
    │   ├── httpClient.js       axios instance
    │   └── travelApi.js        ~30 именованных REST-методов
    ├── composables/            11 composables
    ├── components/             AppNavbar, AppFooter, DestinationCard, ToastContainer
    ├── views/                  8 страниц
    └── assets/style.css        стили + тёмная тема
```

---

## 10. Как запустить

```bash
cd travel-planner
npm install
npm run start   # одновременно: json-server :3000 и Vite dev :5173
```

Открыть `http://localhost:5173/` → откроется `#/` (главная).

---

## Возможные вопросы на защите

**— Почему SPA, а не сохранили MPA?**
Требование ЛР: SPA + vue-router. Плюс на SPA состояние пользователя (`currentUser`, тема, тосты) не пропадает при переходе — раньше каждая страница его перечитывала из `localStorage`.

**— Почему `createWebHashHistory`, а не `createWebHistory`?**
`createWebHistory` (без хеша) требует, чтобы веб-сервер при любом URL отдавал `index.html` — иначе перезагрузка страницы `/dashboard` даёт 404. Хеш-режим (`#/dashboard`) работает на любой статике без настройки, поэтому надёжнее для учебного проекта.

**— Почему axios, а не fetch?**
`fetch` — низкоуровневый: сам по себе не парсит JSON, не сериализует query-параметры, не имеет таймаутов и интерцепторов. axios даёт всё это из коробки. Один `apiClient.get('/users', { params: { email } })` заменяет 5-6 строк ручной сборки запроса.

**— Зачем нужны composables, если можно писать всё в компоненте?**
Чтобы не дублировать код. `useFavorites`, например, нужна на главной, в каталоге, в карточке избранного и в кабинете. Без composable я бы 4 раза копировал одно и то же. Composable — это функция, возвращающая реактивное состояние и методы; вызвал — получил готовое.

**— Как реализован auth guard?**
В `router.beforeEach`: до перехода читаю `meta.requiresAuth` маршрута и `isAuthenticated.value` из `useAuth`. Если нужна авторизация и её нет — возвращаю `{ name: 'login', query: { redirect: to.fullPath } }`, и роутер сам делает редирект. Симметрично для `guestOnly` — не пускаю залогиненного на `/login`.

**— Composition API vs Options API — почему Composition?**
Composition позволяет вынести логику в обычные функции (composables) и переиспользовать. В Options API ради этого нужны mixin'ы — они путают, потому что свойства приходят «из ниоткуда». `<script setup>` — самая лаконичная форма Composition: меньше boilerplate.

**— Почему данные кладутся и в `localStorage`, и на сервер?**
На сервер (json-server) идут пользовательские данные: маршруты, заметки, избранное, идеи — то, что должно переживать перезагрузку и быть «настоящими» данными. В `localStorage` остаётся только сессия (`currentUser`) и UI-настройки (тема) — это локальное состояние, серверу его знать не нужно.

**— Что даёт ленивая загрузка маршрутов (`() => import(...)`)?**
Vite сборкой делает code splitting: каждая страница попадает в отдельный JS-чанк. При первом заходе грузится только главная, остальные подтянутся по мере перехода. Главное приложение стартует быстрее.

**— Где axios-интерцепторы и зачем?**
В `httpClient.js`. Сейчас стоит response-интерцептор для централизованного логирования ошибок. В реальном проекте тут было бы добавление `Authorization` заголовка, обновление токена при 401 и т. п.

**— Что было самым сложным при миграции?**
Соблюсти 1:1 визуальный паритет с ЛР2: вёрстку (page-header, filter-card, dashboard-card, auth-card) переносил по фрагментам, проверял dark-тему. Контраст и видимость надписей в тёмной теме (вкладки кабинета, кнопки) — особенно потребовало точечной правки CSS.
