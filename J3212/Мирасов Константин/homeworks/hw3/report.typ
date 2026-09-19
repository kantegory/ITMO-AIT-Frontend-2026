#set document(title: "Светлая и тёмная темы", author: "Мирасов Константин")
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
Домашняя работа №3\ Светлая и тёмная темы
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
Реализовать светлую и тёмную темы AxonHub с помощью CSS-переменных. Учитывать системное предпочтение пользователя и сохранять вручную выбранную схему.

= Ход работы
== 1. Палитры на CSS-переменных
Цвета определены в `assets/css/tokens.css`. Светлая палитра находится в `:root`, тёмная — в `:root[data-theme='dark']`. Переменные отвечают за фон, текст, поверхности, границы, фокус и состояния ошибок. Компоненты обращаются к ним через `var()`.
#snippet("assets/css/tokens.css", 1, 15, lang: "css")
#snippet("assets/css/tokens.css", 51, 65, lang: "css")

Такое разделение позволяет менять палитру, сохраняя структуру страниц. Для документа без атрибута темы предусмотрены правила `prefers-color-scheme`.

#next()
== 2. Интерфейс в двух темах
Обе схемы используют одинаковые данные, фильтры и расположение элементов. Меняются цвета поверхностей, текста, полей и кнопок. Переключатель находится в шапке сайта.
#shot("theme-light", [Каталог в светлой теме], width: 83%)
#shot("theme-dark", [Тот же каталог в тёмной теме], width: 83%)

#next()
== 3. Выбор и сохранение схемы
При первом открытии используется системная тема. Сохранённое значение `axonhub-theme` имеет приоритет и восстанавливается после перезагрузки и переходов между страницами. Скрипт подключён в head до стилей и задаёт атрибуты темы до отображения содержимого.
#snippet("assets/js/theme.js", 19, 29)

`data-theme` управляет собственными стилями, `data-bs-theme` — компонентами Bootstrap. Доступное имя кнопки указывает, какую схему включит следующее нажатие. Пока ручной выбор не сохранён, смена системной темы обновляет интерфейс.

== 4. Анимация и обработка ограничений
При поддержке View Transition API смена темы сопровождается переходом от кнопки. При настройке reduced motion или отсутствии API атрибуты меняются сразу. Ошибка доступа к localStorage не мешает переключению текущей страницы.
#snippet("assets/js/theme.js", 38, 50)

= Вывод
Палитры отделены от правил компонентов. Интерфейс поддерживает две темы, учитывает системную настройку и сохраняет ручной выбор. При недоступности хранилища или анимации остаётся обычное переключение цветов.
