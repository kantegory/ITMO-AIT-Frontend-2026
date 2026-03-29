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