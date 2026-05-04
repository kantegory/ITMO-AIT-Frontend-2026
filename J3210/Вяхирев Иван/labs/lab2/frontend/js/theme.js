function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIconUse = document.querySelector('#theme-btn use');
  if (themeIconUse) {
    const iconId = theme === 'dark' ? '#brightness-high-fill' : '#moon-fill';
    themeIconUse.setAttribute('href', `assets/sprite.svg${iconId}`);
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
});
