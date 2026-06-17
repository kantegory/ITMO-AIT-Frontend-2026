document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPasswordToggle();
  initLogoutButton();

  const page = document.body.dataset.page;

  if (page === 'login') initLoginPage();
  if (page === 'register') initRegisterPage();

  if (page === 'dashboard') {
    initDashboardPage();
    initMarketWidgets();
  }

  if (page === 'reports') {
    initReportsPage();
    initMarketWidgets();
  }

  if (page === 'integrations') initIntegrationsPage();
});

document.addEventListener('moneyflow-theme-changed', () => {
  if (document.body.dataset.page === 'reports' && typeof initReportsPage === 'function') {
    initReportsPage();
  }
});
