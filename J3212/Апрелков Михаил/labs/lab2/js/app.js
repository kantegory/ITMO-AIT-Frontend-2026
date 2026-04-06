document.addEventListener("DOMContentLoaded", async function () {
  setupThemeToggle();
  setupBudgetSlider();
  setupCopyLink();
  setupAuthNavButton();
  setupAuthForms();

  await initSearchPage();
  await initDestinationPage();
  await initProfilePage();
  await initCollaborationPage();
});

