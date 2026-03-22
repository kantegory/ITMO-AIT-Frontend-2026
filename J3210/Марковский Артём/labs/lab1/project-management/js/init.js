document.addEventListener("DOMContentLoaded", () => {
  syncProjects();

  const pageName = getPageName();

  if (!protectPages(pageName)) {
    return;
  }

  setUserName();
  markNavigation(pageName);
  setupAuthForms();
  setupLogout();

  if (pageName === "dashboard" && typeof renderDashboard === "function") {
    setupDashboardActions();
    renderDashboard();
  }

  if (pageName === "search" && typeof renderSearch === "function") {
    renderSearch();
  }

  if (pageName === "project" && typeof renderProject === "function") {
    renderProject();
  }
});
