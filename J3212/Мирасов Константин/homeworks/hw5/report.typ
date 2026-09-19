#set document(title: "Учебный каталог на Vue", author: "Мирасов Константин")
#set page(paper: "a4", margin: (left: 25mm, right: 20mm, top: 17mm, bottom: 18mm), numbering: "1", number-align: center)
#set text(font: "DejaVu Serif", size: 10.5pt, lang: "ru")
#set par(justify: true, leading: 0.55em)
#set heading(numbering: none)
#show heading.where(level: 1): it => block(above: 13pt, below: 9pt, width: 100%)[#text(fill: rgb("24588a"), size: 14pt, weight: "bold", it.body) #v(3pt) #line(length: 100%, stroke: 0.5pt + rgb("24588a"))]
#show heading.where(level: 2): it => block(above: 10pt, below: 7pt)[#text(size: 12pt, weight: "bold", it.body)]
#show raw.where(block: true): it => block(width: 100%, fill: rgb("f4f6f8"), inset: 8pt, radius: 3pt)[#set text(font: "DejaVu Sans Mono", size: 7.5pt); #it]
#set figure(gap: 5pt)
#show figure.caption: it => {set text(size: 10pt); it}
#let shot(file, caption, width: 100%) = figure(image("report-assets/" + file + ".png", width: width), caption: caption, supplement: [Рисунок])
#let snippet(file, start, end, lang: "js") = {
  block(above: 4pt, below: 3pt)[#text(size: 9pt, fill: rgb("46505b"))[#file · строки #start–#end]]
  raw(read(file).split("\n").slice(start - 1, end).join("\n"), lang: lang, block: true)
}
#let next() = pagebreak()
#set page(footer: none)
#align(center)[
#v(10mm)
#strong[САНКТ-ПЕТЕРБУРГСКИЙ НАЦИОНАЛЬНЫЙ\ ИССЛЕДОВАТЕЛЬСКИЙ УНИВЕРСИТЕТ ИТМО]
#v(35mm)
#strong[Дисциплина: Фронт-энд разработка]
#v(16mm)
#text(size: 17pt, weight: "bold")[ОТЧЁТ]
#v(12mm)
Домашняя работа №5\ Учебный каталог на Vue
]
#v(30mm)
#align(right)[Выполнил:\ студент группы J3212\ Мирасов Константин
#v(9mm)
Проверил:\ Добряков Д. И.]
#v(1fr)
#align(center)[Санкт-Петербург\ 2026 г.]
#pagebreak()
#set page(footer: context align(center, counter(page).display("1")))
= Задача
Создать учебный каталог на Vue, освоить npm scripts, сборку Vite и обмен данными между компонентами через props, события и slot. Реализовать реактивный поиск и фильтрацию локального списка ресурсов.

= Ход работы
== 1. Структура Vue-проекта
Приложение находится в `web`. `main.js` подключает стили и монтирует App. PageLayout задаёт общую разметку, ResourceFilters выводит поля поиска, ResourceRow отображает один ресурс. Исходные данные импортируются из `data/resource-previews.js`.
#shot("vue--", [Учебный каталог на Vue])

`npm ci` устанавливает зависимости по lockfile; `npm run dev` запускает Vite, `npm run build` создаёт сборку, `npm run preview` открывает её локально. Каталог использует локальные данные и не требует запуска mock API.

#next()
== 2. Компоненты и обмен данными
App хранит состояние фильтров. ResourceFilters получает значения как props и сообщает изменения событиями. Родитель связывает их через `v-model:query` и `v-model:type`. Дочерний компонент не изменяет prop напрямую.
#snippet("web/src/components/ResourceFilters.vue", 4, 14)

ResourceRow получает ресурс через обязательный prop и выводит название, описание, тип, задачу, лицензию и размер. Стабильный key по id связывает строку интерфейса с соответствующей записью.
#snippet("web/src/components/ResourceRow.vue", 5, 7)
#snippet("web/src/App.vue", 43, 45, lang: "html")

PageLayout предоставляет общую шапку и подвал, а основное содержимое размещается через slot. Форматирование размера вынесено в `services/format.js`.

#next()
== 3. Реактивная фильтрация
Поисковая строка и тип хранятся в ref. computed нормализует текст и формирует видимый список. Обновление происходит сразу при вводе или выборе типа, без отдельной отправки формы.
#snippet("web/src/App.vue", 8, 18)
#shot("vue-filtered", [Каталог после выбора типа Datasets], width: 90%)

Кнопка Reset filters очищает оба значения. Если совпадений нет, вместо списка отображается сообщение и действие возврата к полному каталогу.

#next()
== 4. Адаптивность и состояния интерфейса
Счётчик результатов использует `role="status"`. На узком экране поля и карточки перестраиваются по доступной ширине, сохраняя подписи и последовательность содержимого.
#shot("vue-mobile", [Каталог при ширине 390 px], width: 43%)

= Вывод
Каталог разделён на компоненты с понятной ответственностью. Props и события передают данные между фильтрами и App, slot задаёт содержимое общего layout, а ref/computed обеспечивают реактивную фильтрацию. npm scripts позволяют запускать приложение и собирать его для публикации.
