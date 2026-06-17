'use strict';
const Auth = (() => {
  function saveSession(token, user) {
    localStorage.setItem('wl_token', token);
    localStorage.setItem('wl_user',  JSON.stringify(user));
  }
  function clearSession() {
    localStorage.removeItem('wl_token');
    localStorage.removeItem('wl_user');
  }
  function isLoggedIn() {
    return !!localStorage.getItem('wl_token');
  }
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('wl_user')) || null;
    } catch {
      return null;
    }
  }
  function getUserId() {
    return getUser()?.id ?? null;
  }
  function getFullName() {
    const u = getUser();
    if (!u) return 'Гость';
    return [u.firstName, u.lastName].filter(Boolean).join(' ');
  }
  function getInitials() {
    const u = getUser();
    if (!u) return '?';
    return ((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase() || '?';
  }
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace('login.html');
    }
  }
  function requireGuest() {
    if (isLoggedIn()) {
      window.location.replace('dashboard.html');
    }
  }
  function logout() {
    clearSession();
    window.location.replace('login.html');
  }
  return {
    saveSession,
    clearSession,
    isLoggedIn,
    getUser,
    getUserId,
    getFullName,
    getInitials,
    requireAuth,
    requireGuest,
    logout,
  };
})();