(function () {
  const API_BASE = 'http://localhost:3000';

  async function signup(data) {
    const resp = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(errorText || 'Ошибка регистрации');
    }
    return resp.json();
  }

  async function login(data) {
    const resp = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(errorText || 'Ошибка входа');
    }
    return resp.json();
  }

  function setAuth(auth) {
    if (!auth || !auth.accessToken || !auth.user) return;
    localStorage.accessToken = auth.accessToken;
    localStorage.user = JSON.stringify(auth.user);

    const role = auth.user.role || 'user';
    localStorage.userType = role;
  }

  function getToken() {
    return localStorage.accessToken || null;
  }

  window.authService = {
    signup,
    login,
    setAuth,
    getToken
  };
})();