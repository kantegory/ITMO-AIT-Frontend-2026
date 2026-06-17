/* LearnFlow API — low-level fetch wrapper + session helpers */

const API = 'http://localhost:3000';

const api = {
  getSession() {
    try { return JSON.parse(localStorage.getItem('session')); } catch { return null; }
  },

  setSession(user) {
    const s = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    localStorage.setItem('session', JSON.stringify(s));
    return s;
  },

  clearSession() {
    localStorage.removeItem('session');
  },

  async get(path) {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`GET ${path} → HTTP ${res.status}`);
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} → HTTP ${res.status}`);
    return res.json();
  },

  async patch(path, body) {
    const res = await fetch(`${API}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH ${path} → HTTP ${res.status}`);
    return res.json();
  },

  async del(path) {
    const res = await fetch(`${API}${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path} → HTTP ${res.status}`);
  },
};
