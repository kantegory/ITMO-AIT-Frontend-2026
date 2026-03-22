document.addEventListener("DOMContentLoaded", () => {
  ensureSessionData();

  const pageName = getPageName();

  if (!protectPages(pageName)) {
    return;
  }

  setUserName();
  markNavigation(pageName);
  setupAuthForms();
  setupLogout();
});
