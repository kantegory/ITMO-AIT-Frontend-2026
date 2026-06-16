const authHelper = {
  save(token, user) {
    localStorage.setItem('mh_token', token);
    localStorage.setItem('mh_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('mh_token');
    localStorage.removeItem('mh_user');
  },
  getToken() {
    return localStorage.getItem('mh_token');
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('mh_user') || 'null');
    } catch {
      return null;
    }
  },
  isLoggedIn() {
    return Boolean(this.getToken());
  },
  async syncMe() {
    if (!this.isLoggedIn()) return null;
    try {
      const { user } = await authApi.me();
      this.save(this.getToken(), user);
      return user;
    } catch {
      this.clear();
      return null;
    }
  },
  logout() {
    this.clear();
    window.location.href = 'search.html';
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  redirectIfLoggedIn(target = 'profile.html') {
    if (this.isLoggedIn()) window.location.href = target;
  },
  updateNavbar() {
    const user = this.getUser();
    document.querySelectorAll('.nav-auth').forEach((el) => el.style.display = user ? '' : 'none');
    document.querySelectorAll('.nav-unauth').forEach((el) => el.style.display = user ? 'none' : '');
    document.querySelectorAll('.nav-username').forEach((el) => {
      el.textContent = user ? (user.name || user.username) : '';
    });
  },
};
