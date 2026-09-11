const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response && error.response.status === 401;
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (isUnauthorized && !isLoginPage) {
      logout();
      window.location.href = 'login.html';
    }
    return Promise.reject(error);
  }
);

function getEvents(filters = {}) {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.type) params.type = filters.type;
  if (filters.city) params.city = filters.city;
  if (filters.date) params.date_gte = filters.date;
  return api.get('/events', { params }).then((response) => response.data);
}

function getEventById(id) {
  return api.get(`/events/${id}`).then((response) => response.data);
}

function saveSession(data) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

function authErrorMessage(error, fallback) {
  if (!error.response) {
    return 'Сервер недоступен. Проверьте, что json-server запущен (npm run api).';
  }
  const messages = {
    'Incorrect password': 'Неверный email или пароль.',
    'Cannot find user': 'Пользователь с таким email не найден.',
    'Email already exists': 'Пользователь с таким email уже зарегистрирован.',
    'Email format is invalid': 'Проверьте формат email.',
    'Password is too short': 'Пароль слишком короткий.',
  };
  return messages[error.response.data] || fallback;
}

async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  return saveSession(data);
}

async function register(name, email, password, role) {
  const { data } = await api.post('/register', { name, email, password, role });
  return saveSession(data);
}

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

function getCurrentUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function isAuthenticated() {
  return Boolean(localStorage.getItem('accessToken'));
}

function requireAuth(redirectTo = 'login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
  }
}

function requireRole(role, redirectTo = 'profile.html') {
  requireAuth();
  const user = getCurrentUser();
  if (user && user.role !== role) {
    window.location.href = redirectTo;
  }
}

function redirectIfAuthenticated(redirectTo = 'profile.html') {
  if (isAuthenticated()) {
    window.location.href = redirectTo;
  }
}

function initHeader() {
  const authButtons = document.querySelector('.js-auth-buttons');
  const userMenu = document.querySelector('.js-user-menu');
  const user = getCurrentUser();

  if (!isAuthenticated() || !user) {
    if (userMenu) userMenu.classList.add('d-none');
    return;
  }

  if (authButtons) authButtons.classList.add('d-none');
  if (userMenu) userMenu.classList.remove('d-none');

  const userName = document.querySelector('.js-user-name');
  if (userName) userName.textContent = user.name;

  const organizerLink = document.querySelector('.js-organizer-link');
  if (organizerLink && user.role !== 'organizer') {
    organizerLink.parentElement.classList.add('d-none');
  }

  const logoutLink = document.querySelector('.js-logout');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
      window.location.href = 'login.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', initHeader);

function getUserTickets(userId) {
  return api.get('/tickets', { params: { userId } }).then((response) => response.data);
}

function createTicket(ticket) {
  return api.post('/tickets', ticket).then((response) => response.data);
}

function getUserRefunds(userId) {
  return api.get('/refunds', { params: { userId } }).then((response) => response.data);
}

function createRefund(refund) {
  return api.post('/refunds', refund).then((response) => response.data);
}

function updateTicketStatus(ticketId, status) {
  return api.patch(`/tickets/${ticketId}`, { status }).then((response) => response.data);
}

function getAllTickets() {
  return api.get('/tickets').then((response) => response.data);
}

function getAllRefunds() {
  return api.get('/refunds').then((response) => response.data);
}

function saveEventReviews(eventId, reviews) {
  return api.patch(`/events/${eventId}`, { reviews }).then((response) => response.data);
}

function createEvent(event) {
  return api.post('/events', event).then((response) => response.data);
}