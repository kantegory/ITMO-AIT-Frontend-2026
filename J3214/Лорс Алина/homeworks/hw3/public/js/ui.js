window.TarelkaUI = (() => {
  const navItems = [
    { page: 'dashboard', href: 'dashboard.html', icon: 'grid-1x2-fill', label: 'Личный кабинет' },
    { page: 'transactions', href: 'transactions.html', icon: 'receipt-cutoff', label: 'Транзакции' },
    { page: 'reports', href: 'reports.html', icon: 'bar-chart-line-fill', label: 'Отчёты' },
    { page: 'integrations', href: 'integrations.html', icon: 'plug-fill', label: 'Интеграции' }
  ];

  const THEME_STORAGE_KEY = 'tarelka-theme';
  const THEME_VALUES = ['light', 'dark'];

  function getStoredTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_VALUES.includes(storedTheme) ? storedTheme : null;
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const getCurrentTheme = () => getStoredTheme() || getSystemTheme();
  const nextTheme = (theme) => theme === 'dark' ? 'light' : 'dark';

  function formatCurrency(amount, currency = 'EUR') {
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
    } catch {
      const symbol = window.TarelkaData.currencySymbols[currency] || currency;
      return `${Number(amount).toLocaleString('ru-RU')} ${symbol}`;
    }
  }

  const formatDate = (date, options = { day: '2-digit', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
  const getInitials = (firstName = '', lastName = '') => `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function themeIconMarkup(iconName) {
    return `<svg class="theme-icon" aria-hidden="true" focusable="false"><use href="assets/icons.svg#icon-${iconName}"></use></svg>`;
  }

  function applyTheme(theme = getCurrentTheme(), options = {}) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    const shouldStore = Boolean(options.store);

    document.documentElement.dataset.theme = normalized;
    document.documentElement.style.colorScheme = normalized;

    if (shouldStore) {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const label = normalized === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', normalized === 'dark' ? 'true' : 'false');
      const icon = normalized === 'dark' ? 'sun' : 'moon';
      const text = normalized === 'dark' ? 'Светлая тема' : 'Тёмная тема';
      button.innerHTML = `${themeIconMarkup(icon)}<span class="d-none d-md-inline ms-2">${text}</span>`;
    });

    window.dispatchEvent(new CustomEvent('tarelka:themechange', { detail: { theme: normalized } }));
  }

  function bindThemeToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      if (button.dataset.themeBound === 'true') return;
      button.dataset.themeBound = 'true';
      button.addEventListener('click', () => applyTheme(nextTheme(getCurrentTheme()), { store: true }));
    });
    applyTheme(getCurrentTheme());
  }

  function bindSystemThemeListener() {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateFromSystem = () => {
      if (!getStoredTheme()) applyTheme(getSystemTheme());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateFromSystem);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(updateFromSystem);
    }
  }

  function renderAuthThemeToggle() {
    if (!document.body.classList.contains('auth-body') || document.getElementById('authThemeToggle')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'authThemeToggle';
    button.className = 'btn btn-outline-primary theme-toggle-floating';
    button.dataset.themeToggle = 'true';
    document.body.appendChild(button);
  }

  function createSidebarMarkup(currentPage, user) {
    const links = navItems
      .map((item) => `<a class="sidebar-link ${currentPage === item.page ? 'active' : ''}" href="${item.href}" ${currentPage === item.page ? 'aria-current="page"' : ''}><i class="bi bi-${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`)
      .join('');

    return `
      <div class="sidebar-brand">
        <div class="sidebar-brand__icon" aria-hidden="true"><i class="bi bi-pie-chart-fill" aria-hidden="true"></i></div>
        <div class="sidebar-brand__text"><h2>Tarelka</h2><p>Ваш личный финансовый сервис</p></div>
      </div>
      <div class="sidebar-user-card" aria-label="Профиль пользователя">
        <div class="sidebar-user-card__label">Профиль</div>
        <div class="sidebar-user-card__name">${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</div>
        <p class="sidebar-user-card__currency">Базовая валюта: ${escapeHtml(user.currency)}</p>
      </div>
      <nav class="sidebar-nav" aria-label="Основная навигация">${links}</nav>
      <div class="sidebar-footer">
        <p>Данные хранятся в mock API на JSON Server. Авторизация — через json-server-auth.</p>
        <button class="btn btn-light w-100" type="button" id="logoutBtnSidebar">Выйти из аккаунта</button>
      </div>
    `;
  }

  function renderLayout() {
    const currentPage = document.body.dataset.page;
    if (!['dashboard', 'transactions', 'reports', 'integrations'].includes(currentPage)) return;

    const user = window.TarelkaStorage.getCurrentUser();
    if (!user) return;

    const sidebar = document.getElementById('sidebarContainer');
    const mobileSidebar = document.getElementById('mobileSidebarContainer');
    if (sidebar) sidebar.innerHTML = createSidebarMarkup(currentPage, user);
    if (mobileSidebar) mobileSidebar.innerHTML = createSidebarMarkup(currentPage, user);

    const topbar = document.getElementById('topbarContainer');
    if (topbar) {
      topbar.innerHTML = `<header class="topbar" role="banner"><nav class="navbar navbar-expand-lg px-3 px-lg-4 gap-2" aria-label="Верхняя панель"><button class="btn btn-outline-secondary d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar" aria-label="Открыть меню навигации"><i class="bi bi-list fs-4" aria-hidden="true"></i></button><div class="topbar-search me-auto"><i class="bi bi-search" aria-hidden="true"></i><label class="visually-hidden" for="globalSearchField">Быстрый поиск по интерфейсу</label><input class="form-control" type="search" id="globalSearchField" placeholder="Быстрый поиск по интерфейсу" autocomplete="off"></div><div class="topbar-meta ms-lg-3"><button class="btn btn-outline-secondary" type="button" data-theme-toggle="true"></button><span class="topbar-notice d-none d-md-inline-flex"><i class="bi bi-cloud-arrow-down me-2" aria-hidden="true"></i>Mock API + внешнее API</span><div class="user-chip" aria-label="Текущий пользователь"><div class="user-chip__avatar" aria-hidden="true">${getInitials(user.firstName, user.lastName)}</div><div><div class="fw-semibold">${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</div><div class="topbar-footer-note">${escapeHtml(user.email)}</div></div></div></div></nav></header>`;
    }

    const footer = document.getElementById('footerContainer');
    if (footer) {
      footer.className = 'app-footer';
      footer.setAttribute('role', 'contentinfo');
      footer.innerHTML = `<div class="d-flex justify-content-between flex-wrap gap-2"><span>Tarelka · ДЗ3: CSS‑переменные и темизация</span></div>`;
    }

    document.addEventListener('click', (event) => {
      if (event.target.closest('#logoutBtnSidebar')) window.TarelkaStorage.logout();
    });

    const globalSearchField = document.getElementById('globalSearchField');
    if (globalSearchField) {
      globalSearchField.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        const value = event.currentTarget.value.trim().toLowerCase();
        const map = {
          кабинет: 'dashboard.html',
          транзакции: 'transactions.html',
          отчёты: 'reports.html',
          интеграции: 'integrations.html'
        };
        const match = Object.keys(map).find((key) => value.includes(key));
        if (match) window.location.href = map[match];
      });
    }

    bindThemeToggles();
  }

  function showToast(message, variant = 'primary') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toastElement = document.createElement('div');
    toastElement.className = 'toast align-items-center text-bg-light border-0';
    toastElement.role = variant === 'danger' ? 'alert' : 'status';
    toastElement.setAttribute('aria-live', variant === 'danger' ? 'assertive' : 'polite');
    toastElement.setAttribute('aria-atomic', 'true');
    const badge = variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary';
    const label = variant === 'danger' ? 'Ошибка' : variant === 'warning' ? 'Внимание' : 'Готово';
    toastElement.innerHTML = `<div class="d-flex"><div class="toast-body"><span class="badge text-bg-${badge} me-2">${label}</span>${escapeHtml(message)}</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть уведомление"></button></div>`;
    container.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement, { delay: 2600 });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  }

  function fillSelect(selectElement, options, placeholder) {
    if (!selectElement) return;
    const normalized = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
    selectElement.innerHTML = `${placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : ''}${normalized.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join('')}`;
  }

  const typeLabel = (type) => ({ income: 'Доход', expense: 'Расход', transfer_in: 'Перевод входящий', transfer_out: 'Перевод исходящий' }[type] || type);

  function statusMarkup(status) {
    const map = {
      completed: ['completed', 'Завершена'],
      pending: ['pending', 'В обработке'],
      connected: ['connected', 'Подключён'],
      disconnected: ['disconnected', 'Не подключён'],
      normal: ['normal', 'Норма'],
      warning: ['warning', 'Почти лимит'],
      exceeded: ['exceeded', 'Превышен']
    };
    const [className, label] = map[status] || ['normal', status];
    return `<span class="status-badge status-badge--${className}" role="status" aria-label="Статус: ${escapeHtml(label)}">${escapeHtml(label)}</span>`;
  }

  function initAccessibility() {
    applyTheme(getCurrentTheme());
    renderAuthThemeToggle();
    bindThemeToggles();
    bindSystemThemeListener();
  }

  return { renderLayout, showToast, formatCurrency, formatDate, fillSelect, typeLabel, statusMarkup, escapeHtml, applyTheme, getCurrentTheme, initAccessibility };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.TarelkaUI.initAccessibility();
  window.TarelkaUI.renderLayout();
});
