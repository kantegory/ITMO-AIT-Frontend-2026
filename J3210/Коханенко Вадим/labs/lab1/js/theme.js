const ThemeManager = {
    currentTheme: 'light',
    
    // Подгрузка темы в зависимости от saved либо от системной
    init() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }

        this.createThemeToggleButton();
        this.applyTheme(this.currentTheme);
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.updateToggleButton(newTheme);
            }
        });
    },
    
    // Применение темы
    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
        this.updateBootstrapTheme(theme);
    },

    
    // Переключение темы
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        if (typeof showNotification === 'function') {
            showNotification(`Переключено на ${newTheme === 'light' ? 'светлую' : 'тёмную'} тему`);
        }
    },
    
    // Кнопка переключения темы
    createThemeToggleButton() {
        if (document.getElementById('themeToggleBtn')) return;
        
        const nav = document.querySelector('.navbar-nav');
        if (!nav) return;
        
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.role = 'listitem';
        
        const button = document.createElement('button');
        button.id = 'themeToggleBtn';
        button.className = 'theme-toggle-btn';
        button.setAttribute('aria-label', 'Переключить тему');
        button.onclick = () => this.toggleTheme();
        
        this.updateToggleButton(this.currentTheme);
        li.appendChild(button);
        nav.appendChild(li);
    },
    
    updateToggleButton(theme) {
        const button = document.getElementById('themeToggleBtn');
        if (!button) return;
        
        if (theme === 'dark') {
            button.innerHTML = '<svg class="icon" width="1em" height="1em" aria-hidden="true"><use xlink:href="sprite.svg#icon-arrow-repeat"></use></svg> Светлая';
        } else {
            button.innerHTML = '<svg class="icon" width="1em" height="1em" aria-hidden="true"><use xlink:href="sprite.svg#icon-arrow-repeat"></use></svg> Тёмная';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});