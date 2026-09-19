#set document(title: "Доступность пользовательского интерфейса", author: "Мирасов Константин")
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
Домашняя работа №2\ Доступность пользовательского интерфейса
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
Улучшить доступность интерфейса AxonHub: обеспечить работу с клавиатурой, понятные подписи полей и действий, заметный фокус и доступные сообщения об изменении состояния.

= Ход работы
== 1. Клавиатурная навигация
Ссылка Skip to main content позволяет перейти к основному содержимому, минуя шапку. Она появляется при фокусе. Цель `main` имеет `tabindex="-1"`, поэтому принимает фокус программно, не создавая лишнюю остановку в обычной последовательности Tab.
#shot("keyboard", [Видимый фокус на ссылке перехода к содержимому], width: 94%)

Кнопки и ссылки сохраняют заметный контур `:focus-visible`. Мобильная панель фильтров использует `details/summary` и доступна с клавиатуры.
#snippet("assets/css/base.css", 42, 49, lang: "css")

#next()
== 2. Подписи полей и ошибки
Каждое поле связано с `label`. `aria-describedby` указывает на подсказку или сообщение об ошибке; `aria-invalid` отражает неверное значение. Общая сводка помогает понять, почему форма не отправлена.
#shot("email-error", [Сводка ошибок и сообщение о формате email], width: 94%)
#snippet("assets/js/forms/validation.js", 7, 17)

При отправке фокус переходит на первое неверное поле. Ввод исправления снимает его ошибку и обновляет сводку. Цвет дополняется текстом, поэтому ошибка не обозначается только цветом.

#next()
== 3. Динамическое содержимое
Во время загрузки список получает `aria-busy`. Количество результатов и обычные уведомления используют `role="status"`. Срочный `role="alert"` применяется к сводке ошибок формы.

Кнопки Edit и Delete получают доступные имена с контекстом комментария. Поле редактора связано с подписью и статусом. После отмены фокус возвращается к исходной кнопке, после удаления — к сообщению списка.
#shot("comment-error", [Сообщение о пустом комментарии и фокус в поле], width: 90%)
#snippet("assets/js/discussion/editor.js", 19, 25)

= Вывод
Добавлены быстрый переход к содержимому, заметный клавиатурный фокус, сводка ошибок, контекстные имена действий и сообщения о динамических изменениях. Ручная проверка интерфейса в Firefox завершена успешно. Сохранённый результат Lighthouse Accessibility для пяти публичных страниц — 100/100.
