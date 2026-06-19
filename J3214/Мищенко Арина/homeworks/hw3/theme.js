/* =============================================
   EduPlatform — theme.js
   Логика переключения тем
   ============================================= */

// Применяем тему: устанавливаем data-theme (наши переменные)
// и data-bs-theme (Bootstrap 5.3 автоматически стилизует
// все свои компоненты — карточки, формы, навбар и т.д.)
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('eduTheme', theme);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.querySelector('i').className =
      theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
  }
}

// Кнопка переключения
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Обновляем иконку после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(theme);
});
