const data = {
    users: [
        {
            id: 1,
            name: "Петров Петр",
            email: "petya@mail.com",
            password: "123456",
            role: "student",
            courses: [101],
            progress: {"101": "80%"},
            certificates: ["Основы C#"]
        },
        {
            id: 2,
            name: "Григорьева Анна",
            email: "anna@mail.com",
            password: "456789",
            role: "student",
            courses: [101],
            progress: {"101": "100%"},
            certificates: ["Основы баз данных"]
        },
        {
            id: 3,
            name: "Андреев Сергей",
            email: "teacher@mail.com",
            password: "555555",
            role: "teacher",
            courses: [101]
        }
    ],

    courses: [
        {
            id: 101,
            title: "Язык программирования Java",
            category: "Программирование",
            level: "Средний",
            price: 15000,
            studentsCount: 150,
            lessons: [
                {
                    id: 0,
                    title: "Урок 1: Введение и Hello World",
                    description: "На этом уроке мы установим JDK, настроим среду разработки IntelliJ IDEA и напишем нашу первую программу, которая выводит текст в консоль",
                    task: "Установите JDK 17 и выведите в консоль фразу 'Hello world!'",
                    materials: ["инструкция_по_установке.pdf", "project.java"]
                },
                {
                    id: 1,
                    title: "Урок 2: Переменные и примитивы",
                    description: "Изучаем типы int, double, boolean и char и учимся проводить математические операции",
                    task: "Создайте две переменные типа int, сложите их и выведите результат в консоль",
                    materials: ["типы_данных.png", "homework.java"]
                },
                {
                    id: 2,
                    title: "Урок 3: Условные операторы",
                    description: "Изучаем конструкции if-else и switch-case",
                    task: "Напишите программу, которая проверяет, является ли число нечетным",
                    materials: ["логические_операции.pdf"]
                }
            ]
        }
    ]
};


function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}


function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
}