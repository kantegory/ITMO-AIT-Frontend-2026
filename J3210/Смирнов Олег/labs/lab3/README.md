# AI Hub — lab3 (Vue.js)

Миграция приложения из lab2 на Vue 3 + Vite.
Сохранены весь функционал и стили; добавлены роутер, axios и composables.

## Запуск

```bash
cd путь/до/lab3
npm install
```

Нужно два терминала.

Терминал 1 — API (json-server на `http://localhost:3000`):
```bash
npm run api
```

Терминал 2 — фронтенд (Vite на `http://localhost:5173`):
```bash
npm run dev
```

Сборка прода: `npm run build` → `dist/`.

## Тестовый аккаунт

| Email | Пароль |
|---|---|
| demo@example.com | password123 |

## Структура

```
lab3/
├── public/
│   └── icons/sprite.svg          # SVG-спрайт (доступен по /icons/sprite.svg)
├── src/
│   ├── api/                      # axios-слой
│   │   ├── client.js             # axios.create({ baseURL: 'http://localhost:3000' })
│   │   ├── models.js
│   │   ├── datasets.js
│   │   └── users.js
│   ├── composables/              # переиспользуемая логика
│   │   ├── useAuth.js            # user (shared ref), login/register/logout/updateProfile
│   │   ├── useTheme.js           # светлая/тёмная тема, persist в localStorage
│   │   ├── useFilters.js         # поиск/сортировка/теги для SearchView
│   │   └── useFormatCount.js     # 1.2k / 3M
│   ├── components/
│   │   ├── layout/               # AppNavbar, AppFooter
│   │   ├── ui/                   # SvgIcon, Avatar, ItemCard, StatButton
│   │   ├── search/               # SearchFilters
│   │   └── detail/               # ItemHeader (шапка детальной страницы)
│   ├── views/                    # экраны под каждый маршрут
│   │   ├── HomeView.vue
│   │   ├── SearchView.vue        # /models и /datasets (через props.type)
│   │   ├── ModelDetailView.vue   # /models/:id
│   │   ├── DatasetDetailView.vue # /datasets/:id
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── DashboardView.vue
│   ├── router/index.js           # маршруты + auth-guard
│   ├── assets/styles/style.css   # темы и кастомные стили (порт из lab2)
│   ├── App.vue                   # layout: navbar + router-view + footer
│   └── main.js                   # createApp, bootstrap, router
├── db.json                       # база для json-server
├── index.html                    # точка входа Vite
├── vite.config.js
└── package.json
```

## Маршруты

| Путь | Компонент | Доступ |
|---|---|---|
| `/` | HomeView | публично |
| `/models` | SearchView | публично |
| `/datasets` | SearchView | публично |
| `/models/:id` | ModelDetailView | публично |
| `/datasets/:id` | DatasetDetailView | публично |
| `/login` | LoginView | только гости |
| `/register` | RegisterView | только гости |
| `/dashboard` | DashboardView | только авторизованные |

Защита маршрутов — `beforeEach`-guard в `src/router/index.js`.
