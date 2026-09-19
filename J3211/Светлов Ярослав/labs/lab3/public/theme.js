const colorScheme = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  document.documentElement.dataset.bsTheme = colorScheme.matches ? 'dark' : 'light';
  window.dispatchEvent(new Event('themechange'));
}
colorScheme.addEventListener('change', applyTheme);
applyTheme();
