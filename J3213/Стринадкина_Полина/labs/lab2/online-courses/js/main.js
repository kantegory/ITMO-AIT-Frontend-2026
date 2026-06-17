function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function confirmDelete() {
  if (confirm("Вы уверены, что хотите удалить курс?")) {
    alert("Курс удалён.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  const logoutItem = document.getElementById('logout-item');
  const profileItem = document.getElementById('profile-item');
  const loginItem = document.getElementById('login-item');
  const registerItem = document.getElementById('register-item');
  const user = JSON.parse(localStorage.getItem('user'));

  // Показать "Кабинет" и "Выйти", скрыть "Вход" и "Регистрацию"
  if (logoutItem && profileItem && user) {
    logoutItem.style.display = 'block';
    profileItem.style.display = 'block';
    loginItem.style.display = 'none';
    registerItem.style.display = 'none';
  }

  // Выйти
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      alert('Вы вышли из аккаунта');
      window.location.href = 'login.html';
    });
  }
});