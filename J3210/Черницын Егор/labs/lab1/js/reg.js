document.getElementById('regForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('floatingName').value;
    const email = document.getElementById('floatingEmail').value;
    const password = document.getElementById('floatingPassword').value;
    const confPassword = document.getElementById('floatingPasswordConfirm').value;

    if (password !== confPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    if (password.length < 8) {
        alert('Пароль должен содержать 8 символов, хотя бы одну букву и цифру');
        return;
    }

    const hasLetter = /[a-zA-Zа-яА-Я]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
        alert('Ошибка: Пароль должен содержать как минимум одну букву и одну цифру!');
        return;
    }

    const checkRes = await fetch(`http://localhost:3000/users?email=${email}`);
    const existingUsers = await checkRes.json();

    if (existingUsers.length > 0) {
        alert('Пользователь с таким email уже существует!');
        return;
    }

    const newUser = { name, email, password };

    const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    if (res.ok) {
        alert('Регистрация успешна! Теперь войдите в систему.');
        window.location.href = 'login.html';
    }
});