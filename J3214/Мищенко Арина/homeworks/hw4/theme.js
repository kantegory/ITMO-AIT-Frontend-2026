/* =============================================
   EduPlatform — theme.js
   Логика переключения тем
   ============================================= */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('eduTheme', theme);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    // Если кнопка содержит SVG-спрайт — обновляем href у <use>
    const useEl = btn.querySelector('use');
    if (useEl) {
      useEl.setAttribute('href',
        theme === 'dark' ? 'sprite.svg#icon-sun' : 'sprite.svg#icon-moon'
      );
    } else {
      // Запасной вариант: Bootstrap Icons через класс
      const icon = btn.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
    );
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', function () {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(theme);
});