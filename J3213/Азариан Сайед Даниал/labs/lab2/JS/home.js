(function initHomeEntryPoint() {
  const root = window;
  root.EventPassHome = root.EventPassHome || {};

  const actions = root.EventPassHome.actions || {};
  if (typeof actions.bootstrapHome === "function") {
    actions.bootstrapHome();
  }
})();
