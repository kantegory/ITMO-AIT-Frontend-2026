export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';
const mq = window.matchMedia('(prefers-color-scheme: light)');

function getStored(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

function systemTheme(): Theme {
  return mq.matches ? 'light' : 'dark';
}

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute(
      'aria-label',
      isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему',
    );
    btn.title = isLight ? 'Тёмная тема' : 'Светлая тема';
    const sun = btn.querySelector<SVGElement>('[data-icon="sun"]');
    const moon = btn.querySelector<SVGElement>('[data-icon="moon"]');
    if (sun) sun.style.display = isLight ? 'none' : '';
    if (moon) moon.style.display = isLight ? '' : 'none';
  });
}

export function initTheme(): void {
  applyTheme(getStored() ?? systemTheme());

  mq.addEventListener('change', (e) => {
    if (!getStored()) applyTheme(e.matches ? 'light' : 'dark');
  });

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-theme-toggle]');
    if (!btn) return;
    e.preventDefault();
    const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
}
