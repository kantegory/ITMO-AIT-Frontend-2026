(function () {
  const TOKEN_KEY = "ai-hub-auth-token";
  const USER_KEY = "ai-hub-auth-user";

  function clearKeyEverywhere(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function saveSession(token, user, remember) {
    const useLocalStorage = remember !== false;
    const storage = useLocalStorage ? localStorage : sessionStorage;

    clearKeyEverywhere(TOKEN_KEY);
    clearKeyEverywhere(USER_KEY);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user || null));
  }

  function clearSession() {
    clearKeyEverywhere(TOKEN_KEY);
    clearKeyEverywhere(USER_KEY);
  }

  function isAuthenticated() {
    return Boolean(getToken());
  }

  function redirectIfAuthenticated(target) {
    if (!isAuthenticated()) return;
    window.location.href = target || "search.html";
  }

  function requireAuth() {
    if (isAuthenticated()) return true;

    const current = `${window.location.pathname.split("/").pop()}${window.location.search || ""}`;
    const params = new URLSearchParams();
    params.set("returnTo", current);
    window.location.href = `authorization.html?${params.toString()}`;
    return false;
  }

  async function logout() {
    try {
      if (isAuthenticated()) {
        await Api.post("/logout", {});
      }
    } catch (error) {
      // Если сервер не отвечает, просто очищаем локальную сессию.
    } finally {
      clearSession();
      window.location.href = "authorization.html";
    }
  }

  function renderAuthNav() {
    const navItem = document.getElementById("authNavItem");
    if (!navItem) return;

    navItem.innerHTML = "";

    if (isAuthenticated()) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-sm btn-outline-secondary";
      button.setAttribute("aria-label", "Выйти из аккаунта");
      button.textContent = "Выйти";
      button.addEventListener("click", logout);
      navItem.appendChild(button);
      return;
    }

    const existingLoginLink = document.querySelector('.top-nav .navbar .nav-link[href="authorization.html"]');
    if (existingLoginLink) {
      return;
    }

    const link = document.createElement("a");
    link.href = "authorization.html";
    link.className = "nav-link";
    link.textContent = "Вход";
    navItem.appendChild(link);
  }

  function setUserNameToElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const user = getUser();
    if (!user) return;

    element.textContent = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Пользователь";
  }

  window.Auth = {
    getToken,
    getUser,
    saveSession,
    clearSession,
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
    renderAuthNav,
    logout,
    setUserNameToElement
  };
})();
