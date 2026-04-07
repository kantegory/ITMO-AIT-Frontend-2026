const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value.trim().toLowerCase();
        const password = document.getElementById('passInput').value.trim();

        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                
                if (String(user.password) === String(password)) {
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userId', user.id);
                    window.location.href = 'personal_acc.html';
                } else {
                    alert('Ошибка: Неверный пароль');
                }
            } else {
                alert('Ошибка: Пользователь с таким Email не найден');
            }
        } catch (err) {
            console.error("Ошибка сервера:", err);
            alert('Сервер недоступен. Проверь терминал!');
        }
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const htmlRoot = document.documentElement; 
    function applyTheme(theme) {
        if (theme === 'light') {
            htmlRoot.classList.add('light-theme');
            htmlRoot.classList.remove('dark-theme');
            if (themeIcon) themeIcon.innerHTML = '<use href="sprite.svg#icon-moon"></use>';
            if (themeText) themeText.innerText = 'Тёмная тема';
        } else {
            htmlRoot.classList.add('dark-theme');
            htmlRoot.classList.remove('light-theme');
            if (themeIcon) themeIcon.innerHTML = '<use href="sprite.svg#icon-sun"></use>';
            if (themeText) themeText.innerText = 'Светлая тема';
        }
    }

    const savedTheme = localStorage.getItem('myfinance-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isLight = htmlRoot.classList.contains('light-theme');
            const newTheme = isLight ? 'dark' : 'light';
            
            applyTheme(newTheme);
            localStorage.setItem('myfinance-theme', newTheme);
        });
    }
});