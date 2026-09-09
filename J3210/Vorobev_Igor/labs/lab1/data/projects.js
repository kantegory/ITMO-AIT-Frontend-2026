window.PROJECTS = [
    { id: 1, name: 'CRM-система', status: 'progress', priority: 'high', team: ['Алексей', 'Мария'], userRole: 'admin' },
    { id: 2, name: 'Сайт магазина', status: 'new', priority: 'medium', team: ['Мария', 'Дмитрий'], userRole: null },
    { id: 3, name: 'Мобильное приложение', status: 'done', priority: 'low', team: ['Дмитрий'], userRole: 'observer' },
    { id: 4, name: 'Интеграция API', status: 'progress', priority: 'high', team: ['Алексей'], userRole: 'member' }
];

window.PROJECT_DETAILS = {
    1: {
        description: 'Разработка CRM-системы для управления клиентами и продажами.',
        deadline: '20.05.2026',
        team: [
            { name: 'Алексей', role: 'Администратор' },
            { name: 'Мария', role: 'Участник' },
            { name: 'Дмитрий', role: 'Наблюдатель' }
        ]
    },
    2: {
        description: 'Интернет-магазин электроники с каталогом и корзиной.',
        deadline: '15.06.2026',
        team: [
            { name: 'Мария', role: 'Администратор' },
            { name: 'Дмитрий', role: 'Участник' }
        ]
    },
    3: {
        description: 'Мобильное приложение для трекинга задач.',
        deadline: '01.07.2026',
        team: [
            { name: 'Дмитрий', role: 'Администратор' }
        ]
    },
    4: {
        description: 'Интеграция внешних API для автоматизации отчетов.',
        deadline: '10.06.2026',
        team: [
            { name: 'Алексей', role: 'Администратор' },
            { name: 'Мария', role: 'Участник' }
        ]
    }
};

window.MOCK_FILES = [
    { id: 1, name: 'ТЗ_v2.pdf', size: '2.4 MB', date: '15.04.2026' },
    { id: 2, name: 'Макеты_UI.fig', size: '18 MB', date: '12.04.2026' },
    { id: 3, name: 'Смета_бюджет.xlsx', size: '0.5 MB', date: '10.04.2026' }
];

window.MOCK_COMMENTS = [
    { id: 1, user: 'Алексей', text: 'Начал работу над API, жду макеты.', time: '10:30' },
    { id: 2, user: 'Мария', text: 'Макеты уже в Figma, ссылка в описании проекта.', time: '11:15' },
    { id: 3, user: 'Дмитрий', text: 'Когда будет готов бэкенд для тестов?', time: 'Вчера' }
];