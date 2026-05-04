document.addEventListener('DOMContentLoaded', function () {
    function setupAuth(formId, isLogin) {
        const form = document.getElementById(formId);
        if (!form) return;

        const emailInp = form.querySelector('input[type="email"]');
        const passInp = form.querySelector('input[type="password"]');
        const btn = form.querySelector('button');

        function validate() {
            const isEmailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value);
            const isPassOk = passInp.value.length >= 8;
            btn.disabled = !(isEmailOk && isPassOk);
        }

        emailInp.addEventListener('input', validate);
        passInp.addEventListener('input', validate);

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = emailInp.value.trim();
            const pass = passInp.value;

            try {
                if (isLogin) {
                    const user = await window.API.login(email);
                    if (user && user.password === pass) {
                        localStorage.setItem('current_user_id', user.id);
                        localStorage.setItem('current_user_email', user.email);
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('ОШИБКА: НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ');
                    }
                } else {
                    const exists = await window.API.login(email);
                    if (exists) {
                        alert('ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ СУЩЕСТВУЕТ');
                    } else {
                        await window.API.register({email: email, password: pass});
                        alert('УСПЕХ: АККАУНТ СОЗДАН!');
                        window.location.href = 'index.html';
                    }
                }
            } catch (error) {
                alert("ОШИБКА СЕРВЕРА!");
            }
        });
    }

    setupAuth('loginForm', true);
    setupAuth('registerForm', false);
});