const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if ((loginForm || registerForm) && localStorage.getItem('jwt_token')) {
    window.location.href = 'index.html';
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('emailInput').value.trim();
        const password = document.getElementById('passwordInput').value.trim();

        try {
            const response = await api.post('/login', { email, password });
            
            const { accessToken, user } = response.data;

            window.authSession.saveAuthSession(accessToken, user);

            window.location.href = 'index.html';

        } catch (error) {
            alert('Неверный email или пароль. Попробуйте снова.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('emailReg').value.trim();
        const password = document.getElementById('passwordReg').value.trim();
        const passwordConfirm = document.getElementById('passwordConfirm').value.trim();

        if (password !== passwordConfirm) {
            alert('Пароли не совпадают!');
            return;
        }

        try {
            const response = await api.post('/register', { 
                email, 
                password, 
                firstName, 
                lastName,
                username
            });
            
            const { accessToken, user } = response.data;

            window.authSession.saveAuthSession(accessToken, user);

            window.location.href = 'index.html';

        } catch (error) {
            alert('Ошибка при регистрации. Возможно, такой email уже используется.');
        }
    });
}