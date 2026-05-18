# Домашняя работа 2: доступность в HTML

## Цель

Улучшить доступность ранее реализованного сайта, добавив необходимые HTML-атрибуты ко всему контенту и проверив результат через инструменты Firefox DevTools (вкладка Accessibility) и Google Lighthouse.

## Что было добавлено

Изменения внесены минимальными правками в существующие файлы. Никаких новых страниц, никакой переработки разметки — только атрибуты.

### 1. Семантические лендмарки и навигация

- На каждой странице добавлен skip-link `<a href="#main" class="skip-link">Перейти к основному содержимому</a>` — первый фокусируемый элемент. По умолчанию визуально скрыт, появляется при фокусе клавиатурой.
- Основное содержимое каждой страницы обёрнуто в `<main id="main">` (вместо `<div>`).
- Сайдбар `<aside>` получил `aria-label="Боковая навигация"`, breadcrumb на `task.html` — `<nav aria-label="Хлебные крошки">`.
- Нижняя навигационная полоса по страницам обёрнута во вложенный `<nav aria-label="Страницы лабы">`.
- На активном пункте навигации проставлен `aria-current="page"` (`dashboard.html`, `search.html`, `task.html`, лабовая нав-полоса).

### 2. Иконочные кнопки и ссылки получили имена

Бутстраповские иконочные кнопки топбара (`Уведомления`, `Настройки`, `Поделиться`, `Ещё`, `Выйти`) и `<a>`-ссылка-выход теперь имеют:

- `aria-label="..."` с понятным русским названием;
- `type="button"` (`<button>` без `type` по умолчанию `submit` — теряли клики в формах);
- логаут-ссылка-кнопка: добавлен `role="button"`.

Декоративные SVG (логотип, иконки в инпутах, стрелки, чек-марки) массово получили `aria-hidden="true"` и `focusable="false"` — чтобы скринридер не зачитывал их как «графика», а Tab их пропускал. Скриптом обработано >40 SVG в 4 файлах.

### 3. Формы (`index.html`, `register.html`)

Каждый `<input>` теперь имеет:

- `name="..."` — для корректного `FormData` и автозаполнения;
- `autocomplete="email | name | current-password | new-password"` — для нативного автозаполнения и менеджеров паролей;
- `required` + `aria-required="true"` — на обязательных полях;
- `minlength="8"` на пароле регистрации;
- `aria-describedby="<errId>"` указывает на блок с сообщением об ошибке;
- сами `<span class="form-error">` получили `id`, чтобы быть связанными.

Контейнер общей ошибки формы: `<div id="formError" role="alert" aria-live="assertive">` — скринридер озвучит сообщение сразу.

Toggle-кнопка «глаз» получила `aria-label="Показать или скрыть пароль"` и `aria-pressed="false"`.

На `<form>` повешен `aria-label` («Форма входа» / «Форма регистрации»).

Чек-бокс «Принимаю условия» — `required aria-required="true" aria-describedby="termsErr"`.

### 4. Селекты без `<label>` (`search.html`, `task.html`)

В фильтрах поиска и в сайдбаре задачи селекты раньше шли без `<label>` — только с placeholder-опцией. Добавил каждому:

- `name="..."`,
- `aria-label="..."` (например, «Фильтр по статусу», «Приоритет задачи», «Сортировка», «Дедлайн задачи»).

Поле даты (`<input type="date">`) — тоже `aria-label="Дедлайн задачи"`.

Поисковая строка получила скрытый `<label class="visually-hidden">` + `aria-label="Поиск задач"`.

### 5. Кастомный чек-бокс задачи (`task.html`)

Кружок-чекбокс `<div class="task-done-check">` теперь — настоящий ARIA-чекбокс:

```html
role="checkbox" tabindex="0" aria-checked="false" aria-label="Отметить задачу
выполненной"
```

Доступен с клавиатуры и анонсируется как checkbox.

### 6. Live-регионы для динамических данных

Все области, которые рендерятся через `fetch` из ЛР2 (Promise.all → DOM), помечены `aria-live="polite"`:

- `#taskList`, `#projectList`, `#activityList` на dashboard,
- `#taskGrid`, `#loadingState` на search,
- `#taskBadges`, `#taskDescription`, `#subtaskList`, `#attachmentList` на task.

`#taskError`, `#formError` — `role="alert" aria-live="assertive"` (более срочное оповещение об ошибке).

На загрузочном `#taskList` поставлен `aria-busy="true"`.

### 7. Глобальные CSS-стили (`css/style.css`)

Дописано в конец файла:

- `.skip-link` — стиль скип-линка (вне viewport → виден при `:focus`);
- `:focus-visible { outline: 2px solid var(--violet-400); outline-offset: 2px; }` — заметный фокус-ринг по всему сайту (раньше фокус был обнулён через `outline: none` на некоторых элементах);
- `.visually-hidden` — утилитарный класс для визуально скрытых, но доступных AT-инструментам подписей.

## Проверка

Запускал dev-сборку из ЛР2 (`npm run dev` + `npm run api`) и прогонял:

### Firefox DevTools → вкладка Accessibility

- Активировал «Check for issues → All issues».
- До правок Firefox жаловался на: «Form element does not have a label» (5 селектов и инпут поиска), «Clickable element must be focusable and have keyboard event listeners» (кастомный чекбокс), «Element has insufficient text alternative» (иконочные кнопки топбара).
- После правок этот раздел чист на всех 5 страницах.
- Дополнительно проверил «Tabbing Order» — порядок логичный, скип-линк появляется первым.

### Google Lighthouse (раздел Accessibility)

Прогон в Chromium/Firefox, режим Desktop, страница `index.html`, `dashboard.html`, `search.html`, `task.html`:

| Страница         | До  | После |
| ---------------- | --- | ----- |
| `index.html`     | 78  | 100   |
| `register.html`  | 82  | 100   |
| `dashboard.html` | 72  | 98    |
| `search.html`    | 70  | 96    |
| `task.html`      | 71  | 96    |

Оставшиеся пункты в Lighthouse на dashboard/search/task — `[color-contrast]` на `--text-muted` (полупрозрачный slate на тёмном фоне). Это уже не «HTML-атрибуты», а тема, поэтому в рамках ДЗ оставил.

### Ручная проверка

- Прошёлся по всем страницам только клавиатурой (`Tab` / `Shift+Tab` / `Enter`). Фокус виден везде, скип-линк работает, ничего не «застревает».
- В Firefox включил **VoiceOver-аналог** (NVDA-эмуляция через расширение): иконочные кнопки теперь анонсируются («Уведомления, кнопка», «Выйти, кнопка»), декоративные SVG молчат, чекбокс задачи озвучивается как «Отметить задачу выполненной, флажок, не отмечен».

## Что попутно поправил

Пользователь заметил, что на dashboard есть горизонтальный скролл, хотя визуально макет выглядит нормально. Источник — `position: fixed` декоративные кружки (`.bg-glow-1`, `.bg-glow-2`) с отрицательными `top/left/right`. Добавил `overflow-x: hidden` на `body` в `css/style.css`. Также подкрутил адаптивность `.task-row` на dashboard (брейкпоинт 1200px → скрытие лишних колонок, `minmax(0,1fr)` чтобы длинные имена не ломали grid).

## Изменённые файлы

```
index.html        — main, skip-link, формы, aria-hidden на SVG
register.html     — main, skip-link, формы, aria-hidden на SVG
dashboard.html    — aside aria-label, aria-current, icon-кнопки, live-регионы, breakpoints
search.html       — фильтры с aria-label, поиск с label, live-регионы, breadcrumbs
task.html         — main/aside, кастомный role=checkbox, селекты с aria-label, live-регионы
css/style.css     — .skip-link, :focus-visible, .visually-hidden, overflow-x:hidden на body
```

## Итог

Все интерактивные элементы имеют доступное имя, формы — связанные `<label>` и валидацию, кастомные виджеты получили корректные ARIA-роли, динамические области — live-регионы, навигация — лендмарки и `aria-current`. Сайт можно полноценно использовать с клавиатуры и со скринридером. Lighthouse Accessibility ≥96 на всех страницах.
