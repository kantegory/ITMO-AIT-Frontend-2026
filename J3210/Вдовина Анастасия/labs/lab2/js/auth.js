function showFormError(form, message) {
  const box = form.querySelector('.js-form-error');
  box.textContent = message;
  box.classList.remove('d-none');
}

function initLoginForm() {
  const form = document.querySelector('.js-login-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.querySelector('.js-form-error').classList.add('d-none');

    try {
      await login(form.elements.email.value, form.elements.password.value);
      window.location.href = 'profile.html';
    } catch (error) {
      showFormError(form, authErrorMessage(error, 'Не удалось войти. Попробуйте ещё раз.'));
    }
  });
}

function initRegisterForm() {
  const form = document.querySelector('.js-register-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.querySelector('.js-form-error').classList.add('d-none');

    if (form.elements.password.value !== form.elements.passwordConfirm.value) {
      showFormError(form, 'Пароли не совпадают.');
      return;
    }

    try {
      // тип аккаунта из формы ЛР1 сохраняем как роль пользователя
      await register(
        form.elements.name.value,
        form.elements.email.value,
        form.elements.password.value,
        form.elements.accountType.value
      );
      window.location.href = 'profile.html';
    } catch (error) {
      showFormError(form, authErrorMessage(error, 'Не удалось зарегистрироваться. Попробуйте ещё раз.'));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // как в примере с checkAuth(): вошедшему на этих страницах делать нечего
  redirectIfAuthenticated();
  initLoginForm();
  initRegisterForm();
});
