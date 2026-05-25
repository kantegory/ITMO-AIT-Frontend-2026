Фреймворк Vue.JS: работа с внешним API средствами библиотеки axios
Лабораторная работа 3: Разработка одностраничного веб-приложения (SPA) с использованием фреймворка Vue.JS

Дедлайн: 11.05.26

Мигрировать ранее разработанное приложение (в рамках ЛР1 и ЛР2) на фреймворк Vue.JS.

Каким требованиям ваше приложение должно соответстовать:

    Должен быть подключён роутер
    Должна быть реализована работа с внешним API (желательно посредством axios)
    Разумное деление на компоненты (продемонстрируйте понимание компонентного подхода)
    Использование composable для выделения повторяющеся функционала в отдельные файлы

---

## Отчёт о выполнении

### Задача

Продолжается работа над вариантом №9 — **«Сервис для управления проектами и командной работы»**. ЛР1 — статическая вёрстка на Bootstrap, ЛР2 — привязка к моковому REST API через axios + json-server-auth с JWT-аутентификацией. В ЛР3 нужно превратить multi-page приложение в полноценный SPA на Vue.js: подключить роутер, сохранить работу с тем же бэкендом через axios, грамотно разбить интерфейс на компоненты и вынести повторяющуюся логику в composables.

### Стек

| Слой | Технология | Зачем |
| --- | --- | --- |
| Фреймворк | **Vue 3** (Composition API, `<script setup>`) | реактивность, SFC, типизированные props/emits |
| Маршрутизация | **vue-router 4** | history-mode, навигационный гард, параметры в URL |
| Сборка / dev | **Vite 5** + `@vitejs/plugin-vue` | HMR, lazy-chunks по роутам, прокси `/api` |
| Язык | **TypeScript** (strict) + `vue-tsc` | типизация SFC и API-контрактов |
| HTTP | **axios** + interceptors | JWT, единая обработка 401 → редирект |
| Mock API | json-server + json-server-auth | сохранён из ЛР2 без изменений |

### Архитектура

```
lab3/
├── index.html                       — один entry-point со скриптом-инициализатором темы
├── server/                          — json-server-auth (из ЛР2, без изменений)
├── assets/sprite.svg                — SVG-спрайт (из ДЗ4, без изменений)
├── css/style.css                    — глобальные стили на CSS-переменных (без изменений)
├── src/
│   ├── main.ts                      — createApp().use(router).mount('#app')
│   ├── App.vue                      — корень: <RouterView/> + init темы
│   ├── shims-vue.d.ts               — типы для импорта `.vue`
│   ├── router/index.ts              — маршруты + beforeEach гард на auth
│   ├── api/                         — axios-слой, переехал из ЛР2 почти без правок
│   │   ├── client.ts                — axios-инстанс, interceptors (401 → router.replace)
│   │   ├── auth.ts, tasks.ts, projects.ts, activity.ts
│   ├── types/                       — domain.ts, api.ts (без изменений)
│   ├── composables/
│   │   ├── useAuth.ts               — реактивный user, login/register/logout
│   │   ├── useTheme.ts              — тема (ref + watch + matchMedia)
│   │   ├── useAsync.ts              — { data, loading, error, run }
│   │   └── useDebouncedRef.ts       — customRef с дебаунсом
│   ├── components/                  — 15 переиспользуемых SFC
│   │   ├── AppShell, AppSidebar, AppTopbar     — каркас приватных страниц
│   │   ├── SvgIcon                              — обёртка над <use href=…sprite#…/>
│   │   ├── ThemeToggle                          — кнопка темы (читает useTheme)
│   │   ├── PasswordInput                        — пароль + eye-toggle, v-model
│   │   ├── StatusBadge, PriorityBadge           — два варианта рендера (pill/badge)
│   │   ├── TaskRow (dashboard) / TaskCard (search)
│   │   ├── StatCard, ProjectItem, ActivityItem, SubtaskItem
│   │   └── LabNav                               — нижняя «навигация по лабе»
│   ├── views/                       — 5 страниц-роутов
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── DashboardView.vue
│   │   ├── SearchView.vue
│   │   └── TaskView.vue
│   └── utils/render.ts              — formatDate/Relative/FileSize, статус/приоритет/роль
└── vite.config.ts, tsconfig.json, package.json
```

### Маршруты

```ts
const routes: RouteRecordRaw[] = [
  { path: '/',          component: () => import('../views/LoginView.vue'),    meta: { guestOnly: true } },
  { path: '/register',  component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue'),meta: { requiresAuth: true } },
  { path: '/search',    component: () => import('../views/SearchView.vue'),   meta: { requiresAuth: true } },
  { path: '/tasks/:id', component: () => import('../views/TaskView.vue'),     meta: { requiresAuth: true }, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) return { name: 'login' };
  if (to.meta.guestOnly && isAuthenticated.value)     return { name: 'dashboard' };
});
```

Несколько содержательных решений:
- **history-mode** (`createWebHistory`), а не hash — URL чистые, как у настоящего SPA.
- **Lazy import** — каждый view собирается в отдельный chunk (Vite сам делит сборку). Login/Register тянутся ~2 KB gzip каждый, не нагружая первый paint.
- **`/tasks/:id`** с `props: true` вместо `?id=…` из ЛР2 — параметр приходит во view как обычный prop, нет необходимости парсить query.
- **Один централизованный гард** `beforeEach` вместо ручных `requireAuth()` / `redirectIfAuthed()` в каждой странице. Глобальный, тривиально переиспользуется на новые роуты.

### API-слой

Перенесён из ЛР2 практически без изменений — это и есть смысл «работы с внешним API через axios» в ЛР3. Все четыре модуля (`auth`, `tasks`, `projects`, `activity`) и axios-инстанс с interceptors сохранены. Единственная правка — в response-interceptor по 401:

```ts
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      const { router } = await import('../router');
      if (router.currentRoute.value.name !== 'login') {
        void router.replace({ name: 'login' });
      }
    }
    return Promise.reject(error);
  },
);
```

Lazy-import роутера разрывает кольцо `client → router → views → api/client`. В SPA-мире `location.replace` сработал бы тоже, но он перезагружает приложение целиком — терялся бы смысл клиентской маршрутизации.

### Composables

Главная архитектурная фишка Composition API: повторяющаяся логика выносится не в миксины и не в утилиты, а в *функции-фабрики*, возвращающие ref/computed. Я выделил четыре composable.

**1. `useAuth()`** — единственный источник правды о текущем пользователе. Модульный `ref<User|null>`, проинициализированный из `localStorage`, плюс методы.

```ts
const user = ref<User | null>(getCurrentUser());

export function useAuth() {
  async function login(payload: LoginRequest) {
    user.value = await apiLogin(payload);
  }
  function logout() {
    apiLogout();
    user.value = null;
  }
  return { user: computed(() => user.value),
           isAuthenticated: computed(() => user.value !== null),
           login, register, logout, refresh };
}
```

Тот же `ref` шарят роутер-гард, топбар (для имени/аватара/логаут-ссылки) и все views, где нужен `user.id` (фильтр assigneeId, отметка «вы»). Когда логаут пишет `user.value = null`, гард немедленно перенаправляет.

**2. `useTheme()`** — заменил императивный `utils/theme.ts` из ДЗ3. `ref<'light'|'dark'>`, в `watch` пишется в `localStorage` и обновляется `data-theme` на `<html>`; listener `matchMedia` следит за системой, **но только пока пользователь не сделал явный выбор**. Делает то же, что и раньше, но без ручного делегата кликов — кнопка `ThemeToggle` напрямую дёргает `toggle()`.

**3. `useAsync<T>(fn)`** — типовая обёртка для запросов. До этого в каждой странице был тройной паттерн `loading/error/data`-флагов и copy-paste try/catch. Стало:

```ts
const { data, loading, error, run } = useAsync<DashboardData>(
  async () => {
    const [tasks, projects, activity] = await Promise.all([…]);
    return { tasks, projects, activity };
  },
  'Не удалось загрузить данные',
);
onMounted(run);
```

В шаблоне — `v-if="loading"`, `v-else-if="error"`, `v-else`. Меньше кода, меньше места для багов.

**4. `useDebouncedRef<T>(initial, delay)`** — реактивный аналог `utils/debounce.ts` через `customRef`. В SearchView:

```ts
const query = useDebouncedRef('', 300);
watch([filters, query], () => loadTasks());
```

Запись в `query.value` срабатывает с задержкой → реактивный `watch` не вызывает API на каждое нажатие. В ЛР2 для этого нужно было руками привязывать обработчик `input` и обвязывать его `debounce(fn, 300)`.

### Компонентный подход

Из ЛР2 я унаследовал пять `renderXxx`-функций по 30–60 строк каждая, которые собирали HTML строкой и подсовывали в `innerHTML`. В Vue эти простыни превратились в декларативные компоненты:

- **AppShell + AppSidebar + AppTopbar** — каркас приватных страниц вынесен один раз. Каждый view-приватной-странички — `<AppShell title="…"> <main>…</main> </AppShell>`. В TaskView используется именованный слот `topbar-left` для хлебных крошек.
- **SvgIcon** превратил каждое подключение иконки из четырёх атрибутов + `<use>` в `<SvgIcon name="search" />`. Также Vite-импорт `?url` гарантирует правильную хеш-ссылку в проде.
- **PasswordInput** — был copy-paste в LoginView и RegisterView (показ/скрытие пароля + классы валидации). Сейчас `v-model`-совместимый SFC, который Login и Register просто используют:
  ```html
  <PasswordInput v-model="password" autocomplete="current-password" :invalid="passwordInvalid" />
  ```
- **StatusBadge / PriorityBadge** имеют две формы — компактная «пилюля» для строк/карточек и крупный «бейдж» для шапки задачи. Это `prop variant`, а не два разных компонента.
- **TaskRow vs TaskCard** — нарочно два разных компонента, потому что у них принципиально разная вёрстка (строка с 4 колонками против карточки с 5 + кнопка-меню). Объединять через `v-if` внутри одного — анти-паттерн.
- **StatCard / ProjectItem / ActivityItem / SubtaskItem** — атомарные «глупые» компоненты с одним props-объектом, без бизнес-логики.

Все компоненты типизированы через `defineProps<{ … }>()` — TypeScript ловит передачу неправильного `priority` или забытый required-prop.

### Views — что внутри каждой

- **LoginView** — `v-model` на email/password, валидация в обработчике submit, формы реактивны (ошибка пропадает при правке поля), вызывает `useAuth().login` + `router.replace('/dashboard')`. Ошибка с сервера показывается через `v-if="formError"`.
- **RegisterView** — то же + `reactive`-объект `form` и параллельный `invalid`-объект флагов на каждое поле. Логика валидации — обычная функция, возвращает `boolean`.
- **DashboardView** — `useAsync<DashboardData>` грузит `Promise.all([tasks, projects, activity])`, в шаблоне — `v-for` по `TaskRow` / `ProjectItem` / `ActivityItem`. Агрегаты (`overdueCount`, `inProgress`, `doneCount`) — `computed`, автоматически пересчитываются.
- **SearchView** — `reactive(filters)` + дебаунсированный `query`. `watch([filters, query], loadTasks)` — единственная точка, где собирается запрос. Сброс — `Object.assign(filters, INITIAL)`. Никакой ручной подписки на change/input, никаких querySelector.
- **TaskView** — `id` приходит как prop из роутера (`/tasks/:id` + `props: true`). Параллельно грузим `getTask(id)` и `getProjects()`. Реализован **optimistic UI**: на любое изменение (статус / приоритет / дедлайн / чекбокс подзадачи) сразу мутируем локальный `task.value`, шлём PATCH в фоне; при ошибке откатываемся к backup. `watch(taskId)` перезагружает данные при переходе между задачами без размонтирования компонента.

### Темизация и FOUC

Inline-скрипт, выставляющий `data-theme` до загрузки CSS, переехал в новый `index.html` ровно один раз — раньше он был продублирован в пяти HTML-страницах. После маунта приложения `useTheme().init()` (вызван в `App.vue` через `onMounted`) подхватывает дальнейшее поведение: watch на `localStorage`, listener `matchMedia`. Перезагрузка `/dashboard` или `/tasks/42` не вызывает вспышки темы — `data-theme` уже выставлен до того, как Vite-bundle стартует.

### Ход решения

1. **Сетап.** Добавил в `package.json` `vue`, `vue-router`, `@vitejs/plugin-vue`, `vue-tsc`. В `vite.config.ts` — `plugins: [vue()]`, прокси `/api` оставил из ЛР2. `tsconfig.json` дополнил `jsx: "preserve"` и включил `.vue` в `include`. Написал `shims-vue.d.ts` для импорта SFC.
2. **Один HTML.** Удалил `register.html`, `dashboard.html`, `search.html`, `task.html`. В `index.html` оставил `<div id="app"></div>`, подключение глобального CSS и FOUC-скрипт. Точка входа — `/src/main.ts`.
3. **Роутер.** Написал `router/index.ts` с пятью lazy-маршрутами и `beforeEach`-гардом. Wildcard `/:pathMatch(.*)*` → `/`.
4. **Composables.** Реализовал четыре composable, описанные выше. На каждый — тестовая проверка: `useAuth()` шарит ref между топбаром и страницей, `useAsync()` сбрасывает error на каждый run, `useDebouncedRef` корректно дёргает trigger.
5. **API.** Перенёс `src/api/*` и `src/types/*` из ЛР2 один-в-один, в `client.ts` переписал interceptor 401 на router-redirect. Удалил `utils/guard.ts`, `utils/theme.ts`, `utils/debounce.ts` — их логика теперь в composables/гарде.
6. **Компоненты.** Раскопировал HTML из старых страниц в 15 SFC, каждый — с типизированными props. Минимальный — `SvgIcon` (один template-тэг), максимальный — `AppSidebar` (с RouterLink/active-class). Стили остались глобальными (`css/style.css` неизменён), а специфичные для бывшей страницы — переехали в `<style>`-блоки соответствующего view.
7. **Views.** Каждая страница из `pages/*.ts` стала SFC во `views/`. Где была императивная функция `renderTask()` — теперь декларативный шаблон, реагирующий на изменение `task.value`.
8. **Проверка.** `npx vue-tsc --noEmit` — 0 ошибок. `npx vite build` — успешная сборка: один `index.html` (1 КБ), общий JS (143 КБ → 55 КБ gzip), отдельный chunk на каждый view (2–4 КБ gzip), CSS поделён по views. Спрайт автоматически перехеширован Vite, `<use href>` переписан на новый путь.

### Сравнение с ЛР2 — что упростилось

| | ЛР2 (vanilla TS) | ЛР3 (Vue) |
| --- | --- | --- |
| Точек входа в Vite | 5 HTML | 1 HTML |
| Переходов между страницами | full reload | client-side router |
| Гард авторизации | `requireAuth()` в каждом `pages/*.ts` | один `beforeEach` |
| Рендеринг списка задач | `taskList.innerHTML = tasks.map(...).join('')` | `<TaskRow v-for="t in tasks"/>` |
| Шаринг user между UI | `getCurrentUser()` в каждом файле | `useAuth().user` — реактивный ref |
| Переключение темы | глобальный делегат + ручной sync кнопок | `useTheme.toggle()`, кнопки сами реактивны |
| Дебаунс поиска | `debounce(fn, 300)` + listener | `useDebouncedRef` + `watch` |
| Валидация форм | вручную классы `is-invalid` | `:class="{ 'is-invalid': invalid.email }"` |
| Сборка | multi-page, всё в одном chunk | per-route lazy chunks |

Главное — пропал ручной DOM: ни одного `document.getElementById`, ни одного `innerHTML`, ни одного `addEventListener`. Шаблон описывает желаемое состояние, реактивность сама приводит DOM в соответствие.

### Запуск

```bash
npm install
npm run api          # http://localhost:3000 — json-server-auth
npm run dev          # http://localhost:5173 — Vite + HMR
# либо прод-сборка:
npm run build        # vue-tsc --noEmit && vite build
npm run preview
```

Демо-учётка: `demo@taskerai.app` / `demo1234` (унаследована из ЛР2). Регистрация работает — пароль хешируется `json-server-auth` на стороне сервера.

### Проверка работы

- `/` без токена — форма входа; с токеном — редирект на `/dashboard` (гард).
- `/dashboard` без токена — редирект на `/` (гард).
- Логин → токен в `localStorage` → `useAuth.user` обновляется → топбар и сайдбар реактивно показывают имя/инициал → `router.replace('/dashboard')`.
- Регистрация → `register()` сохраняет accessToken → автоматический логин.
- Dashboard: четыре статистики (всего/в работе/выполнено/просрочено) — `computed`-агрегаты по списку задач. Прогресс проектов — реальные данные `/projects`. Лента активности — `/activity?_sort=createdAt&_order=desc&_limit=4`.
- Search: ввод «прог» в строку поиска → ровно один запрос `/tasks?q=прог&_sort=createdAt&_order=desc` спустя 300 мс. Смена фильтра — мгновенный запрос. «Сбросить» сразу же возвращает дефолт.
- Task: переход `/tasks/3` — `props.id="3"` приходит в view, грузится `GET /tasks/3` + `GET /projects` параллельно. Смена селекта статуса/приоритета или даты дедлайна — оптимистичный апдейт + `PATCH /tasks/3`. Чекбокс подзадачи — то же самое.
- Переключатель темы переключает обе ветки CSS-переменных, выбор сохраняется в `localStorage`, после reload — без вспышки.
- Logout — токен удаляется, `user.value = null`, гард мгновенно сбрасывает на `/`.
- `vue-tsc --noEmit` — 0 ошибок.
- `vite build` — успешно, размер итогового JS укладывается в 55 КБ gzip.

### Итог

- Multi-page приложение полностью переведено на Vue 3 + vue-router; пять HTML-страниц превратились в один SPA с client-side роутингом и lazy-chunks.
- Axios-слой и mock-API из ЛР2 переиспользованы без изменений архитектуры (минимальная правка interceptor-а 401 на router-редирект).
- 15 SFC-компонентов с типизированными props, переиспользуемая «оболочка» (`AppShell`), атомарные «глупые» компоненты для списков и бейджей.
- Четыре composable (`useAuth`, `useTheme`, `useAsync`, `useDebouncedRef`) централизуют состояние пользователя, тему, паттерн загрузки данных и дебаунс. Это и есть тот самый «выделенный повторяющийся функционал», который требует ЛР.
- Сохранены наработки ДЗ2 (a11y-атрибуты, live-регионы, skip-link, role=checkbox для кастомной отметки задачи), ДЗ3 (две темы, FOUC-защита, prefers-color-scheme) и ДЗ4 (общий SVG-спрайт).
- Strict-TypeScript-режим, `vue-tsc` проходит без ошибок. Прод-сборка чистая.
