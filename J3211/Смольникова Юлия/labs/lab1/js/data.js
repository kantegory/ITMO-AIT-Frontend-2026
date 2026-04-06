const initialCourses = [
    {
        id: 1,
        title: "Основы HTML & CSS",
        subject: "Веб-разработка",
        level: "Новичок",
        price: 0,
        desc: "Научитесь создавать современные адаптивные сайты с нуля. HTML5, CSS3, Bootstrap, адаптивная верстка.",
        lessons: [
            { title: "1. Введение в HTML", duration: "05:00", videoId: "dQw4w9WgXcQ" },
            { title: "2. Структура HTML-документа", duration: "12:30", videoId: "dQw4w9WgXcQ" },
            { title: "3. Основы CSS", duration: "10:15", videoId: "dQw4w9WgXcQ" },
            { title: "4. Flexbox и Grid", duration: "15:00", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [
            { title: "Конспект курса.pdf", link: "#" }
        ],
        tasks: [
            { title: "Сверстать главную страницу сайта", deadline: "Без дедлайна" }
        ]
    },
    {
        id: 2,
        title: "JavaScript с нуля",
        subject: "Программирование",
        level: "Новичок",
        price: 1200,
        desc: "Переменные, функции, DOM, события и практика на реальных мини-задачах.",
        lessons: [
            { title: "1. Переменные и типы данных", duration: "08:40", videoId: "dQw4w9WgXcQ" },
            { title: "2. Условия и циклы", duration: "11:20", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 3,
        title: "UI/UX Дизайн интерфейсов",
        subject: "Дизайн",
        level: "Средний",
        price: 2000,
        desc: "Принципы проектирования интерфейсов, работа с Figma, сетки, композиция и UX.",
        lessons: [
            { title: "1. Что такое UX", duration: "09:00", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 4,
        title: "Интернет-маркетинг",
        subject: "Маркетинг",
        level: "Новичок",
        price: 1800,
        desc: "Основы digital-маркетинга, контент, таргетинг, воронки и аналитика.",
        lessons: [
            { title: "1. Введение в маркетинг", duration: "07:30", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 5,
        title: "Продвинутый CSS",
        subject: "Веб-разработка",
        level: "Средний",
        price: 1400,
        desc: "Анимации, сложные layout, кастомные компоненты и современная адаптивность.",
        lessons: [
            { title: "1. CSS Grid Advanced", duration: "13:00", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 6,
        title: "Python для начинающих",
        subject: "Программирование",
        level: "Новичок",
        price: 1600,
        desc: "Синтаксис Python, условия, циклы, функции и работа со структурами данных.",
        lessons: [
            { title: "1. Введение в Python", duration: "10:10", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 7,
        title: "Java для начинающих",
        subject: "Программирование",
        level: "Новичок",
        price: 1500,
        desc: "Изучение основ Java: синтаксис, ООП, коллекции и потоки ввода-вывода.",
        lessons: [
            { title: "1. Введение в Java", duration: "10:00", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    },
    {
        id: 8,
        title: "React.js Разработка",
        subject: "Веб-разработка",
        level: "Средний",
        price: 3500,
        desc: "Создание современных SPA приложений на React. Хуки, Router, управление состоянием.",
        lessons: [
            { title: "1. JSX и Компоненты", duration: "12:00", videoId: "dQw4w9WgXcQ" }
        ],
        materials: [],
        tasks: []
    }
];

function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}

function getAllCourses() {
    return cloneDeep(initialCourses);
}

function getCourseById(courseId) {
    return cloneDeep(
        initialCourses.find(course => course.id === Number(courseId)) || null
    );
}