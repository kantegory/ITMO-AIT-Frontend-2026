document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // проверяем сохранённую тему в LocalStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // применяем тему к сайту
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // вешаем обработчик клика
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (!currentTheme || currentTheme === 'light') {
            newTheme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});