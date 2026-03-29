document.getElementById('regBtn').addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPass').value.trim();
    const confirmPass = document.getElementById('regPassConfirm').value.trim();

    if (!name || !email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (password !== confirmPass) {
        alert('Пароли не совпадают!');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            localStorage.setItem('userName', name);
            
            window.location.href = 'personal_acc.html';
        } else {
            alert('Ошибка при регистрации. Попробуйте другой Email.');
        }
    } catch (error) {
        alert('Сервер недоступен');
    }
});