const defaultProgram = [
    {
        title: "Способы защиты населения, материальных, культурных ценностей",
        items: [
            {
                title: "Прогнозирование и оценка обстановки",
                content: "В этой теме разбирается, как заранее оценивать риски, анализировать данные и планировать действия при различных сценариях."
            },
            {
                title: "Организация управления, связи и оповещения",
                content: "Здесь рассматриваются каналы связи, схемы взаимодействия и порядок оповещения людей при возникновении угроз."
            },
            {
                title: "Организация РХБЗ населения и работников организации",
                content: "Тема описывает базовые меры радиационной, химической и биологической защиты, а также правила поведения персонала."
            },
            {
                title: "Организация инженерной защиты населения",
                content: "В уроке дается обзор инженерных решений: укрытия, защитные конструкции и подготовка объектов к ЧС."
            },
            {
                title: "Организация защиты путем эвакуации",
                content: "Разбираем маршруты эвакуации, порядок действий и взаимодействие с ответственными службами."
            },
            {
                title: "Организация медицинской профилактики",
                content: "Основные профилактические мероприятия, первая помощь и алгоритмы действий до прибытия медслужб."
            },
            {
                title: "Средства индивидуальной защиты",
                content: "Обзор СИЗ, правила выбора, хранения и правильного использования в разных ситуациях."
            }
        ]
    },
    {
        title: "Организация выполнения мероприятий по ликвидации ЧС",
        items: [
            {
                title: "Организация работы КЧС и ОПБ",
                content: "Структура комиссии, зоны ответственности и порядок принятия решений при ликвидации последствий ЧС."
            },
            {
                title: "Действия должностных лиц ГО и РСЧС",
                content: "Кто и за что отвечает, какие решения принимаются на каждом этапе и как контролируется выполнение."
            },
            {
                title: "Первичные средства пожаротушения",
                content: "Типы огнетушителей, правила применения и базовая безопасность при тушении возгораний."
            },
            {
                title: "Порядок создания спасательных служб и НАСФ",
                content: "Как формируются нештатные аварийно-спасательные формирования и как организуется их работа."
            },
            {
                title: "Организация всестороннего обеспечения сил ГО и РСЧС",
                content: "Логистика, ресурсы, техника и коммуникации для эффективной работы спасательных подразделений."
            }
        ]
    },
    {
        title: "Организация и осуществление подготовки населения в области ГО",
        items: [
            {
                title: "Деятельность должностных лиц и специалистов ГО и РСЧС",
                content: "Обязанности ответственных лиц, планирование обучения и организация контрольных мероприятий."
            },
            {
                title: "Организация обучения работников организаций в области ГО",
                content: "Подходы к обучению персонала, форматы занятий и контроль усвоения материала."
            },
            {
                title: "Организация и проведение учений и тренировок",
                content: "Этапы подготовки учебных тревог, тренировки взаимодействия и анализ результатов."
            },
            {
                title: "Организация пропаганды и информирования населения",
                content: "Как формировать информированность населения через памятки, объявления и цифровые каналы."
            },
            {
                title: "Создание и использование технических средств информирования",
                content: "Технические решения для своевременного доведения информации до людей."
            },
            {
                title: "Особенности обучения в области ГО и защиты от ЧС",
                content: "Ключевые методики обучения для разных групп населения и организаций."
            },
            {
                title: "Обеспечение безопасности людей при пожаре",
                content: "Профилактика, действия при пожаре и организация безопасной эвакуации."
            }
        ]
    },
    {
        title: "Итоговый тест",
        items: [
            {
                title: "Тестовое задание",
                content: "Контрольный тест по основным темам курса для проверки усвоения материала."
            }
        ]
    }
];

window.coursesData = [
    {
        id: 1,
        title: "JavaScript с нуля",
        description: "Основы JS: переменные, функции, массивы и DOM.",
        fullDescription: "Подробный курс по JavaScript для старта в веб-разработке. Разбираем синтаксис, работу с данными, событиями и DOM.",
        author: "Иван Петров",
        rating: 4.7,
        students: 1240,
        price: 3900,
        level: "Начальный",
        language: "Русский",
        image: "https://picsum.photos/seed/js-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Марина", rating: 5, text: "Очень понятное объяснение, отлично для старта."},
            {author: "Алексей", rating: 4, text: "Хороший курс, хотелось бы больше задач по DOM."}
        ]
    },
    {
        id: 2,
        title: "Python для начинающих",
        description: "Пошаговый курс по Python с практическими задачами.",
        fullDescription: "Базовый курс Python: переменные, циклы, функции, структуры данных и работа с файлами.",
        author: "Анна Смирнова",
        rating: 4.8,
        students: 2150,
        price: 4500,
        level: "Начальный",
        language: "Русский",
        image: "https://picsum.photos/seed/python-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Елена", rating: 5, text: "Структурировано и доступно."},
            {author: "Игорь", rating: 4, text: "Полезно, но некоторые темы хочется глубже."}
        ]
    },
    {
        id: 3,
        title: "Advanced React Patterns",
        description: "Hooks, performance optimizations, reusable architecture.",
        fullDescription: "Advanced курс по React для разработчиков с базовым опытом.",
        author: "Michael Johnson",
        rating: 4.6,
        students: 980,
        price: 7200,
        level: "Продвинутый",
        language: "Английский",
        image: "https://picsum.photos/seed/react-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Diana", rating: 5, text: "Great real-world examples."},
            {author: "Roman", rating: 4, text: "Good content for intermediate+ level."}
        ]
    },
    {
        id: 4,
        title: "SQL и базы данных",
        description: "Запросы, JOIN, индексы и проектирование схем.",
        fullDescription: "Курс по SQL и базам данных: от простых SELECT до JOIN, индексов и проектирования таблиц.",
        author: "Дмитрий Орлов",
        rating: 4.5,
        students: 1430,
        price: 5200,
        level: "Средний",
        language: "Русский",
        image: "https://picsum.photos/seed/sql-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Сергей", rating: 5, text: "Наконец-то разобрался с JOIN."}
        ]
    },
    {
        id: 5,
        title: "UI/UX Basics",
        description: "Principles of interfaces, typography and user flow.",
        fullDescription: "Introduction to UX principles, interface hierarchy, typography and basic user journey mapping.",
        author: "Emma Clark",
        rating: 4.3,
        students: 740,
        price: 3100,
        level: "Начальный",
        language: "Английский",
        image: "https://picsum.photos/seed/uiux-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Nina", rating: 4, text: "Good intro for non-designers."}
        ]
    },
    {
        id: 6,
        title: "Node.js API Development",
        description: "Express, REST, authentication and deployment.",
        fullDescription: "Практический курс по созданию API на Node.js и Express.",
        author: "Daniel Brown",
        rating: 4.4,
        students: 860,
        price: 6400,
        level: "Средний",
        language: "Английский",
        image: "https://picsum.photos/seed/node-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Artem", rating: 4, text: "Useful, especially auth module."}
        ]
    },
    {
        id: 7,
        title: "Алгоритмы и структуры данных",
        description: "Массивы, списки, деревья и базовые алгоритмы.",
        fullDescription: "Курс для понимания алгоритмического мышления.",
        author: "Олег Соколов",
        rating: 4.9,
        students: 1660,
        price: 5800,
        level: "Продвинутый",
        language: "Русский",
        image: "https://picsum.photos/seed/algorithms-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Кирилл", rating: 5, text: "Сильный курс, много пользы для собесов."}
        ]
    },
    {
        id: 8,
        title: "HTML & CSS Practice",
        description: "Верстка адаптивных страниц на реальных примерах.",
        fullDescription: "Практика по HTML/CSS: работа с сетками, адаптивностью и базовыми компонентами интерфейса.",
        author: "Екатерина Белова",
        rating: 4.2,
        students: 1320,
        price: 2800,
        level: "Начальный",
        language: "Русский",
        image: "https://picsum.photos/seed/htmlcss-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Оля", rating: 4, text: "Хорошо для старта во фронтенде."}
        ]
    },
    {
        id: 9,
        title: "Data Analysis with Pandas",
        description: "Data cleaning, tables, charts and practical notebooks.",
        fullDescription: "Course about data analysis with Pandas.",
        author: "Sophia Walker",
        rating: 4.6,
        students: 910,
        price: 6800,
        level: "Средний",
        language: "Английский",
        image: "https://picsum.photos/seed/pandas-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Victor", rating: 5, text: "Very practical notebook exercises."}
        ]
    },
    {
        id: 10,
        title: "TypeScript на практике",
        description: "Типизация, интерфейсы, generics и работа с проектом.",
        fullDescription: "Переход с JavaScript на TypeScript.",
        author: "Павел Новиков",
        rating: 4.7,
        students: 1090,
        price: 6100,
        level: "Средний",
        language: "Русский",
        image: "https://picsum.photos/seed/ts-course/900/420",
        program: defaultProgram,
        comments: [
            {author: "Никита", rating: 5, text: "Теперь TS стал понятным."}
        ]
    }
];
