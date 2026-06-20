# Отчёт по ЛР2 — TripPlanner

Студент: **Тиуков Даниил**, группа **J3213**
Проект: `labs/lab-2/travel-planner` (ветка `dz-5`)

---

## 1. Что было в ЛР1

В первой лабораторной работе TripPlanner был реализован как чисто статический сайт:

- HTML5 + CSS3 + Bootstrap 5 + Vanilla JavaScript;
- набор страниц (главная, каталог, деталь направления, кабинет, совместное планирование, вход, регистрация);
- единый `navbar`/`footer`, hero-блок, карточки направлений;
- backend отсутствовал — **все данные хранились в `localStorage`**: пользователь, маршруты, заметки, избранное, участники, общие заметки, идеи и голоса;
- регистрация и вход были имитацией через `localStorage`, без отдельного хранилища пользователей.

---

## 2. Что добавилось в ЛР2

### 2.1. `json-server` как имитация backend
- В `package.json` добавлена зависимость `json-server` и npm-скрипт:
  ```
  npm run server  → json-server --watch db.json --port 3000
  ```
- Создан файл `db.json` с десятью REST-коллекциями:
  `users`, `destinations`, `reviews`, `routes`, `notes`, `favorites`,
  `participants`, `stages`, `shared-notes`, `ideas`.
- Все ключевые сущности теперь живут на сервере, а не в браузере.

### 2.2. Слой API — `js/api.js`
- Появился отдельный модуль `TravelApi` — обёртка над `fetch` с REST-методами
  (`get / post / put / patch / delete`) и обработкой HTTP-ошибок.
- Под каждую сущность сделаны именованные методы:
  `getDestinations`, `addRoute`, `updateNote`, `deleteFavorite`,
  `addParticipant`, `addStage`, `updateIdea` и т. д.
- В ЛР1 такой абстракции не было — каждая страница работала с `localStorage` напрямую.

### 2.3. Регистрация и вход через REST
- `TravelApi.register()` делает реальный `POST /users` и **проверяет
  уникальность email** перед записью (через `GET /users?email=…`).
- `TravelApi.login()` ищет пользователя по фильтру
  `GET /users?email=…&password=…`; результат либо найден, либо нет.
- В `localStorage` теперь хранится только текущая сессия
  (`tripplannerCurrentUser`), а не сами пользователи.

### 2.4. Перенос всех CRUD-операций на сервер
| Раздел | В ЛР1 | В ЛР2 |
|---|---|---|
| Направления каталога | хардкод/локальный массив | `GET /destinations` |
| Отзывы | localStorage | `GET/POST /reviews?destinationId=` |
| Личные маршруты | localStorage | `GET/POST/PATCH/DELETE /routes` |
| Личные заметки | localStorage | `GET/POST/PATCH/DELETE /notes` |
| Избранное | localStorage | `GET/POST/DELETE /favorites` |
| Участники поездки | localStorage | `GET/POST /participants` |
| Этапы общего маршрута | localStorage | `GET/POST/PATCH/DELETE /stages` |
| Общие заметки | localStorage | `GET/POST/DELETE /shared-notes` |
| Идеи и голоса | localStorage | `GET/POST/PATCH /ideas` |

### 2.5. Защищённые разделы
- `dashboard.html` и `collaboration.html` теперь делают редирект на
  `login.html`, если в сессии нет пользователя.
- Пункты меню `Кабинет` и `Совместное планирование` показываются только
  авторизованным (атрибут `data-auth-only`); `Вход`/`Регистрация` — только
  гостям (`data-guest-only`). Логика — в `TravelApp.syncAuthNavigation`.

### 2.6. Светлая и тёмная темы
- Переключатель темы в navbar (солнце/луна), значение пишется в
  `localStorage` под ключом `tripplannerTheme`.
- В `<head>` каждой страницы стоит inline-скрипт, применяющий тему **до**
  отрисовки, чтобы не мигало белым при загрузке тёмной темы.
- Учитывается системная настройка `prefers-color-scheme` для первого
  запуска; смена системной темы тоже обрабатывается, если пользователь
  ещё не выбирал тему вручную.

### 2.7. Toast-уведомления
- `TravelApp.showToast(message, type)` создаёт Bootstrap-toast в
  контейнере `#toastContainer`. Используется во всех формах:
  «Маршрут добавлен», «Идея добавлена», «Ошибка при сохранении» и т. д.
- В ЛР1 использовались только инлайн-алерты на формах.

### 2.8. UI-доработки совместного планирования
- В карточках идей строка «Поддержали: N + кнопка Поддержать идею»
  переведена в горизонтальную компоновку с не переносящимся текстом и
  компактными отступами (`.idea-actions` в `css/style.css`,
  `js/collaboration.js`). Раньше при узких колонках кнопка вылезала за
  пределы карточки.

### 2.9. Прочие исправления
- Скрыт «Личный кабинет» и «Совместное планирование» для неавторизованных
  пользователей (через `data-auth-only`).
- Добавлена кнопка **выхода из профиля** в кабинете.
- Защита от прямого открытия защищённых страниц без авторизации.
- Поправлены переполнения текста в карточках совместного планирования.
- Устранено наложение карточки в hero-блоке на главной.

---

## 3. Сводная таблица отличий

| Аспект | ЛР1 | ЛР2 |
|---|---|---|
| Хранение данных | `localStorage` | `json-server` + `db.json` |
| Слой обращения к данным | прямой доступ | модуль `TravelApi` (REST) |
| Регистрация | localStorage | `POST /users` + проверка уникальности email |
| Вход | localStorage | `GET /users?email=&password=` |
| Сессия | localStorage | localStorage (только её) |
| Темы | — | светлая/тёмная, авто-определение |
| Уведомления | inline-алерты | Bootstrap Toast |
| Защищённые разделы | — | редирект для `dashboard` и `collaboration` |
| Запуск | открыть `index.html` | `npm install` → `npm run server` + статический сервер |

---

## 4. Как запустить ЛР2

```bash
cd travel-planner
npm install
npm run server     # поднимает http://localhost:3000 (json-server)
```

HTML открывать через статический сервер (например, `npx serve .` или
WebStorm → Open in Browser), а не как `file://` — иначе браузер заблокирует
запросы к `localhost:3000`.
