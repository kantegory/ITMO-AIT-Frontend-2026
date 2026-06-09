(function () {
  const API_BASE = 'http://localhost:3000';

  function getAuthHeaders() {
    const token = localStorage.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function fetchJson(url, opts = {}) {
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const text = await resp.text().catch(() => null);
      if (resp.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        window.location.href = 'login.html';
      }
      throw new Error(text || `HTTP ${resp.status}`);
    }
    if (resp.status === 204) return null;
    return await resp.json().catch(() => null);
  }

  async function getEvents() {
    return await fetchJson(`${API_BASE}/events`);
  }

  async function getEventById(id) {
    return await fetchJson(`${API_BASE}/events/${id}`);
  }

  async function createEvent(data) {
    return await fetchJson(`${API_BASE}/600/events`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
      body: JSON.stringify(data)
    });
  }

  async function getUserEvents(userId) {
    return await fetchJson(`${API_BASE}/events?userId=${userId}`);
  }

  async function getTickets() {
    return await fetchJson(`${API_BASE}/600/tickets`, { headers: getAuthHeaders() });
  }

  async function getTicketsByEvent(eventId) {
    return await fetchJson(`${API_BASE}/tickets?eventId=${eventId}`);
  }

  async function createTicket(data) {
    return await fetchJson(`${API_BASE}/600/tickets`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
      body: JSON.stringify(data)
    });
  }

  async function deleteTicket(id) {
    return await fetchJson(`${API_BASE}/600/tickets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }

  async function getReturns() {
    return await fetchJson(`${API_BASE}/600/returns`, { headers: getAuthHeaders() });
  }

  async function getReturnsByEvent(eventId) {
    return await fetchJson(`${API_BASE}/returns?eventId=${eventId}`);
  }

  async function createReturn(data) {
    return await fetchJson(`${API_BASE}/600/returns`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
      body: JSON.stringify(data)
    });
  }

  async function getReviews(eventId) {
    return await fetchJson(`${API_BASE}/reviews?eventId=${eventId}`);
  }

  async function createReview(data) {
    return await fetchJson(`${API_BASE}/600/reviews`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
      body: JSON.stringify(data)
    });
  }

  window.api = {
    getAuthHeaders,
    fetchJson,
    getEvents,
    getEventById,
    createEvent,
    getUserEvents,
    getTickets,
    getTicketsByEvent,
    createTicket,
    deleteTicket,
    getReturns,
    getReturnsByEvent,
    createReturn,
    getReviews,
    createReview
  };

  window.tp = window.tp || {};
  window.tp.getEvents = window.api.getEvents;

  window.tp = window.tp || {};
  window.tp.requireUser = function () {
    const role = localStorage.userType || '';
    if (role !== 'user') {
      if (role === 'organizer') {
        alert('Раздел "Мои билеты" доступен только для обычных пользователей');
        window.location.href = 'organizer.html';
      } else {
        alert('Авторизуйтесь как пользователь для доступа к этому разделу');
        window.location.href = 'login.html';
      }
    }
  };

  window.tp.requireOrganizer = function () {
    const role = localStorage.userType || '';
    if (role !== 'organizer') {
      alert('Вы не являетесь организатором');
      window.location.href = 'dashboard.html';
    }
  };
})();