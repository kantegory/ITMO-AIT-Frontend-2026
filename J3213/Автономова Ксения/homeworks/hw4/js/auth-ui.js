document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = loginForm.querySelector('#email').value.trim();
      const password = loginForm.querySelector('#password').value;
      const selectedRole = loginForm.querySelector('#userType') ? loginForm.querySelector('#userType').value : '';
      try {
        const auth = await window.authService.login({ email, password });
        if (selectedRole && selectedRole !== auth.user.role) {

          const actualLabel = auth.user.role === 'organizer' ? 'организатор' : 'пользователь';
          const selectedLabel = selectedRole === 'organizer' ? 'организатор' : 'пользователь';
          alert(`Вы зарегистрированы как ${actualLabel}, но выбрали вход как ${selectedLabel}. Пожалуйста, выберите правильную роль.`);
          return;
        }

        window.authService.setAuth(auth);
        const role = auth.user.role || localStorage.userType;
        if (role === 'organizer') {
          window.location.href = 'organizer.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      } catch (err) {
        alert(err.message || 'Не удалось войти');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = registerForm.querySelector('#name').value.trim();
      const email = registerForm.querySelector('#email').value.trim();
      const password = registerForm.querySelector('#password').value;
      const confirm = registerForm.querySelector('#confirm').value;
      const role = registerForm.querySelector('#userType').value;
      if (password !== confirm) {
        alert('Пароли не совпадают');
        return;
      }
      const parts = name.split(/\s+/);
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ') || '';
      try {
        await window.authService.signup({ email, password, firstName, lastName, role });

        const auth = await window.authService.login({ email, password });
        window.authService.setAuth(auth);
        if (role === 'organizer') {
          window.location.href = 'organizer.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      } catch (err) {
        alert(err.message || 'Не удалось зарегистрироваться');
      }
    });
  }
});