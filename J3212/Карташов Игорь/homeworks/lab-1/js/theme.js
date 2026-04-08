(function () {
  var STORAGE_KEY = 'dataflow-theme';
  var THEMES = ['light', 'dark', 'red'];
  var ICONS = {
    light: 'bi bi-moon-fill',
    dark:  'bi bi-palette-fill',
    red:   'bi bi-sun-fill'
  };

  function getPreferred() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (THEMES.indexOf(saved) !== -1) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = ICONS[theme] || ICONS.light;
  }

  function toggle() {
    var current = document.body.getAttribute('data-theme') || getPreferred();
    var idx = THEMES.indexOf(current);
    var next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next);
  }

  applyTheme(getPreferred());

  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggle);
})();
