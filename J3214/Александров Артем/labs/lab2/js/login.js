document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
      // отмена автоперезагрузки
      event.preventDefault();

      // считываем значения полей
      const email = document.querySelector('#emailInput').value.trim();
      const password = document.querySelector('#passwordInput').value.trim();

      // проверка на существование пользователя
      const user = await getUserByEmail(email);

      if (!user) {
        alert('the user with this email address was not found!');
        return;
      }

      // проверяем пароль
      if (user.password !== password) {
        alert('wrong password!');
        return;
      }

      // если все совпало - сохраняем сессию и переходим на дашборд
      setCurrentUser(user);
      window.location.href = 'dashboard.html';
    });
});