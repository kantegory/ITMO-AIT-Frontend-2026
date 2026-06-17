(function (global) {
  'use strict';

  var STORAGE_KEY = 'projecthub_theme';
  var THEMES = ['light', 'dark'];

  function getSystemTheme() {
    if (global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function getSavedTheme() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(raw) !== -1 ? raw : null;
    } catch (e) {
      return null;
    }
  }

  function getEffectiveTheme() {
    return getSavedTheme() || getSystemTheme();
  }

  function applyTheme(theme) {
    var resolved = THEMES.indexOf(theme) !== -1 ? theme : getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', resolved);
    updateToggles(resolved);
  }

  function setTheme(theme) {
    if (THEMES.indexOf(theme) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    applyTheme(theme);
  }

  function toggleTheme() {
    var next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function updateToggles(theme) {
    var labels = {
      light: { icon: '🌙', label: 'Включить тёмную тему' },
      dark: { icon: '☀️', label: 'Включить светлую тему' },
    };
    var info = labels[theme] || labels.light;
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = info.icon;
      btn.setAttribute('aria-label', info.label);
      btn.setAttribute('title', info.label);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function initToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  function init() {
    applyTheme(getEffectiveTheme());
    initToggles();

    if (global.matchMedia) {
      var mq = global.matchMedia('(prefers-color-scheme: dark)');
      var listener = function () {
        if (!getSavedTheme()) applyTheme(getSystemTheme());
      };
      if (mq.addEventListener) mq.addEventListener('change', listener);
      else if (mq.addListener) mq.addListener(listener);
    }
  }

  applyTheme(getEffectiveTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.ProjectHubTheme = {
    get: getEffectiveTheme,
    set: setTheme,
    toggle: toggleTheme,
  };
})(typeof window !== 'undefined' ? window : this);
