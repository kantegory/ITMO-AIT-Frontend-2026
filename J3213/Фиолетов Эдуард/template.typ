#let paragraph_indent = 1.25cm

#let report_setup(body) = {
  set page(
    paper: "a4",
    margin: (left: 20mm, right: 20mm, top: 20mm, bottom: 20mm),
    numbering: "1",
  )
  set align(left)
  set text(font: ("Helvetica", "Helvetica Neue", "Arial"), size: 12pt, lang: "ru")
  set par(justify: true, first-line-indent: (amount: paragraph_indent, all: true), leading: 0.68em)
  set heading(numbering: "1.")
  show heading: it => block(above: 1.2em, below: 0.65em, pad(left: paragraph_indent)[#it])
  show raw: set text(font: "Menlo", size: 9.5pt, fill: rgb("#222222"))

  body
}

#let title_page(
  number,
  title,
  task_type: none,
  discipline: none,
  teacher: none,
  student: "Фиолетов Эдуард Анджеевич",
  group: "J3213",
) = {
  assert(task_type != none, message: "title_page requires task_type")
  assert(discipline != none, message: "title_page requires discipline")
  assert(teacher != none, message: "title_page requires teacher")

  set page(
    paper: "a4",
    margin: (left: 25mm, right: 25mm, top: 25mm, bottom: 25mm),
    numbering: none,
  )
  set align(center)
  set text(font: "Times New Roman", size: 14pt, lang: "ru")
  set par(justify: false, leading: 0.65em)

  v(5mm)
  text(weight: "bold")[
    САНКТ-ПЕТЕРБУРГСКИЙ НАЦИОНАЛЬНЫЙ \
    ИССЛЕДОВАТЕЛЬСКИЙ УНИВЕРСИТЕТ ИТМО
  ]

  v(10mm)
  text(weight: "bold")[Инженерия Искусственного Интеллекта]

  v(35mm)
  text(weight: "bold")[#task_type № #number]

  v(1mm)
  [Дисциплина: #discipline]

  v(10mm)
  [“#title”]

  v(38mm)
  align(right)[
    #box(width: 100mm)[
      #align(right)[
        #text(weight: "bold")[Выполнил:] \
        #student

        #v(1mm)
        Группа #group

        #v(14mm)
        #text(weight: "bold")[Проверил:] \
        #teacher
      ]
    ]
  ]

  v(1fr)

  [Санкт-Петербург]
  v(1mm)
  [2026 г.]

  pagebreak()
}

#let toc() = {
  set outline.entry(fill: none)
  outline(title: [Содержание])
  pagebreak()
}

#let source(path, desc) = [
  - #text(font: "Menlo", size: 10pt, fill: rgb("#222222"))[#path] - #desc
]

#let screenshot(path, caption) = {
  block(above: 0.9em, below: 0.9em)[
    #set par(justify: false, first-line-indent: 0pt)
    #align(center)[
      #image(path, width: 90%)
      #v(2mm)
      #text(size: 10pt)[#caption]
    ]
  ]
}
