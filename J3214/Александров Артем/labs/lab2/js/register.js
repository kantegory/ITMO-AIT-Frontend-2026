document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#registerForm');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // собираем значения из полей
      const name = document.querySelector('#nameInput').value.trim();
      const email = document.querySelector('#emailInput').value.trim();
      const password = document.querySelector('#passwordInput').value.trim();
      const confirmPassword = document.querySelector('#confirmPasswordInput').value.trim();

      // проверяем совпадение паролей
      if (password !== confirmPassword) {
        alert("passwords don't match!");
        return;
      }

      // проверяем, не занят ли email на сервере
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        alert('the user with this Email has already been registered!');
        return;
      }

      // формируем объект нового пользователя
      const newUser = {
        name: name,
        email: email,
        password: password
      };

      // создаем юзера (пост-запрос)
      const createdUser = await createUser(newUser);

      if (createdUser) {
        setCurrentUser(createdUser);
        window.location.href = 'dashboard.html';
      } else {
        alert('failed to register. try again later');
      }
    });
});