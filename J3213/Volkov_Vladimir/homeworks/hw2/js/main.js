document.addEventListener('DOMContentLoaded', () => {
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