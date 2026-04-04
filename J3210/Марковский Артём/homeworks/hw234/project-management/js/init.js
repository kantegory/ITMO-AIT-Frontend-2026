document.addEventListener("DOMContentLoaded", () => {
  void initializeApp();
});

async function initializeApp() {
  syncProjects();

  const pageName = getPageName();

  if (!protectPages(pageName)) {
    return;
  }

  setUserName();
  markNavigation(pageName);

  if (typeof setupThemeToggle === "function") {
    setupThemeToggle();
  }
  setupAuthForms();
  setupLogout();

  if (pageName === "dashboard" && typeof renderDashboard === "function") {
    setupDashboardActions();
    await renderDashboard();
  }

  if (pageName === "search" && typeof renderSearch === "function") {
    await renderSearch();
  }

  if (pageName === "project" && typeof renderProject === "function") {
    await renderProject();
  }
}
