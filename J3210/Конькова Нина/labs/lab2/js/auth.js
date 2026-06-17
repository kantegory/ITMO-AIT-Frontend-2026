document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const inputEmail = document.getElementById('email').value.trim();
            const inputPassword = document.getElementById('password').value.trim();

            try {
                const response = await fetch('http://localhost:3000/users');
                const allUsers = await response.json();

                const foundUser = allUsers.find(u =>
                    u.email === inputEmail && u.password === inputPassword
                );

                if (foundUser) {
                    localStorage.setItem('isAuth', 'true');
                    localStorage.setItem('user', JSON.stringify(foundUser));
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Ошибка: Неверный email или пароль!');
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Сервер (json-server) не запущен!');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuth');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}
});