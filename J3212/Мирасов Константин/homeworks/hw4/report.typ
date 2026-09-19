#set document(title: "SVG-спрайт интерфейса", author: "Мирасов Константин")
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
Домашняя работа №4\ SVG-спрайт интерфейса
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
Объединить интерфейсные SVG-иконки AxonHub в общий спрайт. Сохранить внешний вид, поддержку тем и доступные названия элементов.

= Ход работы
== 1. Структура спрайта
`assets/icons.svg` содержит элементы `symbol` с уникальными id и собственным viewBox. Интерфейс выбирает символ через `use` и фрагмент URL после знака решётки. Геометрия хранится в одном месте и повторно используется на разных страницах.

Заголовки символов модели, датасета и иллюстрации:
#snippet("assets/icons.svg", 16, 16, lang: "xml")
#snippet("assets/icons.svg", 23, 23, lang: "xml")
#snippet("assets/icons.svg", 36, 36, lang: "xml")
#shot("index", [Каталог с иконками из общего SVG-спрайта], width: 90%)

#next()
== 2. Подключение в разметке и JavaScript
Декоративная иконка поиска скрыта от вспомогательных технологий: назначение поля уже выражено текстовой подписью. Для интерактивных элементов доступное имя задаётся текстом или `aria-label`.
#snippet("index.html", 95, 97, lang: "html")

При создании строки каталога JavaScript выбирает database для датасета и box для модели. Вместо копирования SVG-разметки меняется ссылка на символ.
#snippet("assets/js/explore.js", 30, 38)
#shot("theme-light", [Разные символы обозначают модель и датасет], width: 87%)

#next()
== 3. Цвет и состав ресурсов
Одноцветные иконки используют `currentColor` и наследуют цвет текста. Логотип и иллюстрация сохраняют собственные цвета. Поэтому смена темы не требует отдельных светлых и тёмных копий иконок.
#shot("header-light", [Иконки шапки в светлой теме], width: 65%)
#shot("header-dark", [Иконки шапки в тёмной теме], width: 65%)
#snippet("assets/css/base.css", 161, 168, lang: "css")

Основной файл интерфейсной графики — `assets/icons.svg`. Отдельный `assets/icons/axon-mark.svg` служит favicon вкладки браузера; в самой странице логотип берётся из спрайта. Файл лицензии Bootstrap Icons сохранён рядом с ресурсами.

= Вывод
Интерфейсные SVG объединены в набор повторно используемых символов. Разметка и JavaScript обращаются к одному спрайту, а наследование currentColor сохраняет согласованность иконок с темой интерфейса.
