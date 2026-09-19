(() => {
  const root = document.documentElement;
  const storageKey = 'axonhub-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const valid = (value) => ['system', 'light', 'dark'].includes(value);
  let preference = 'system';
  let transition = null;
  let button;

  try {
    const saved = localStorage.getItem(storageKey);

    if (valid(saved)) {
      preference = saved;
    }
  } catch {}

  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.bsTheme = theme;

    if (button) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }

  apply();

  async function change(value, origin) {
    if (!valid(value) || transition) {
      return;
    }

    preference = value;

    try {
      localStorage.setItem(storageKey, value);
    } catch {}

    const next = value === 'system' ? (system.matches ? 'dark' : 'light') : value;

    if (next === root.dataset.theme || reducedMotion.matches || !document.startViewTransition) {
      apply();

      return;
    }

    const bounds = origin.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-radius', `${radius}px`);

    try {
      transition = document.startViewTransition(apply);
      button.setAttribute('aria-disabled', 'true');

      transition.ready.catch(() => {});
      await transition.finished;
    } catch {
      apply();
    } finally {
      transition = null;
      button.removeAttribute('aria-disabled');
    }
  }

  system.addEventListener('change', () => {
    if (preference !== 'system') {
      return;
    }

    transition?.skipTransition();
    apply();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      transition?.skipTransition();
    }
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) {
      return;
    }

    preference = valid(event.newValue) ? event.newValue : 'system';
    transition?.skipTransition();
    apply();
  });
  window.addEventListener('pageshow', () => {
    try {
      const saved = localStorage.getItem(storageKey);
      preference = valid(saved) ? saved : 'system';
    } catch {}

    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    button = document.querySelector('#theme-toggle');

    if (!button) {
      return;
    }

    document.querySelector('.axon-theme-controls').hidden = false;
    apply();
    button.addEventListener('click', () =>
      change(root.dataset.theme === 'dark' ? 'light' : 'dark', button),
    );
  });
})();
