(() => {
  const App = window.App || {};

  App.auth?.initAuthGuard?.();
  App.auth?.initCurrentUserUI?.();
  App.auth?.initPasswordToggle?.();
  App.auth?.initLoginPage?.();
  App.auth?.initRegisterValidation?.();

  App.pipelines?.init?.();
  App.dashboard?.init?.();
  App.pipelineDetails?.init?.();
  App.monitoring?.init?.();

  App.logout?.init?.();
})();
