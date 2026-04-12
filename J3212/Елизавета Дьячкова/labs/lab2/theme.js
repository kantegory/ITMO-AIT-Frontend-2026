(function () {
  var STORAGE_KEY = 'tickethub_theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function getPreference() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'auto') return v;
    } catch (_) {}
    return 'auto';
  }

  function resolveToDataTheme(preference) {
    if (preference === 'light') return 'light';
    if (preference === 'dark') return 'dark';
    return media.matches ? 'dark' : 'light';
  }

  function apply() {
    var pref = getPreference();
    var resolved = resolveToDataTheme(pref);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-preference', pref);
  }

  function setPreference(value) {
    if (value !== 'light' && value !== 'dark' && value !== 'auto') return;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
    apply();
    syncSelect();
  }

  function syncSelect() {
    var sel = document.getElementById('themeSelect');
    if (sel) sel.value = getPreference();
  }

  apply();

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', function () {
      if (getPreference() === 'auto') apply();
    });
  } else if (typeof media.addListener === 'function') {
    media.addListener(function () {
      if (getPreference() === 'auto') apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('themeSelect');
    if (sel) {
      sel.value = getPreference();
      sel.addEventListener('change', function () {
        setPreference(sel.value);
      });
    }
  });
})();
