const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('floatingEmail').value;
    const password = document.getElementById('floatingPassword').value;

    try {
        const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
        const users = await response.json();

        if (users.length > 0) {
            const user = users[0];
            localStorage.setItem('mff_user_id', user.id);
            localStorage.setItem('mff_user_name', user.name);

            alert(`Добро пожаловать, ${user.name}!`);
            window.location.href = 'dash.html';
        } else {
            alert('Неверный email или пароль!');
        }
    } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
        alert('Ошибка сервера. Проверьте, запущен ли json-server.');
    }
});