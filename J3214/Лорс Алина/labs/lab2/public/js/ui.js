window.TarelkaUI = (() => {
  const navItems = [
    { page: 'dashboard', href: 'dashboard.html', icon: 'grid-1x2-fill', label: 'Личный кабинет' },
    { page: 'transactions', href: 'transactions.html', icon: 'receipt-cutoff', label: 'Транзакции' },
    { page: 'reports', href: 'reports.html', icon: 'bar-chart-line-fill', label: 'Отчёты' },
    { page: 'integrations', href: 'integrations.html', icon: 'plug-fill', label: 'Интеграции' }
  ];

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

  function createSidebarMarkup(currentPage, user) {
    const links = navItems
      .map((item) => `<a class="sidebar-link ${currentPage === item.page ? 'active' : ''}" href="${item.href}"><i class="bi bi-${item.icon}"></i><span>${item.label}</span></a>`)
      .join('');

    return `
      <div class="sidebar-brand">
        <div class="sidebar-brand__icon"><i class="bi bi-pie-chart-fill"></i></div>
        <div class="sidebar-brand__text"><h2>Tarelka</h2><p>Ваш личный финансовый сервис</p></div>
      </div>
      <div class="sidebar-user-card">
        <div class="sidebar-user-card__label">Профиль</div>
        <div class="sidebar-user-card__name">${user.firstName} ${user.lastName}</div>
        <p class="sidebar-user-card__currency">Базовая валюта: ${user.currency}</p>
      </div>
      <nav class="sidebar-nav">${links}</nav>
      <div class="sidebar-footer">
        <p>Данные хранятся в mock API на JSON Server. Авторизация — через json-server-auth.</p>
        <button class="btn btn-light w-100" id="logoutBtnSidebar">Выйти</button>
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
      topbar.innerHTML = `<header class="topbar"><nav class="navbar navbar-expand-lg px-3 px-lg-4"><button class="btn btn-outline-secondary d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar"><i class="bi bi-list fs-4"></i></button><div class="topbar-search me-auto"><i class="bi bi-search"></i><input class="form-control" type="search" id="globalSearchField" placeholder="Быстрый поиск по интерфейсу"></div><div class="topbar-meta ms-lg-3"><span class="topbar-notice d-none d-md-inline-flex"><i class="bi bi-cloud-arrow-down me-2"></i>Mock API + внешнее API</span><div class="user-chip"><div class="user-chip__avatar">${getInitials(user.firstName, user.lastName)}</div><div><div class="fw-semibold">${user.firstName} ${user.lastName}</div><div class="topbar-footer-note">${user.email}</div></div></div></div></nav></header>`;
    }

    const footer = document.getElementById('footerContainer');
    if (footer) {
      footer.className = 'app-footer';
      footer.innerHTML = `<div class="d-flex justify-content-between flex-wrap gap-2"><span>Tarelka · ЛР2: fetch + JSON Server + внешнее API</span></div>`;
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
  }

  function showToast(message, variant = 'primary') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toastElement = document.createElement('div');
    toastElement.className = 'toast align-items-center text-bg-light border-0';
    toastElement.role = 'alert';
    toastElement.innerHTML = `<div class="d-flex"><div class="toast-body"><span class="badge text-bg-${variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary'} me-2">${variant === 'danger' ? 'Ошибка' : variant === 'warning' ? 'Внимание' : 'Готово'}</span>${message}</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    container.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement, { delay: 2600 });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  }

  function fillSelect(selectElement, options, placeholder) {
    if (!selectElement) return;
    const normalized = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
    selectElement.innerHTML = `${placeholder ? `<option value="">${placeholder}</option>` : ''}${normalized.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}`;
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
    return `<span class="status-badge status-badge--${className}">${label}</span>`;
  }

  return { renderLayout, showToast, formatCurrency, formatDate, fillSelect, typeLabel, statusMarkup };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.TarelkaUI.renderLayout();
});
