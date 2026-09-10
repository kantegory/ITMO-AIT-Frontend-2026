const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Токен, выданный при входе, подставляется в каждый запрос автоматически —
// иначе его пришлось бы дописывать руками в каждую функцию ниже.
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Токен живёт час. Когда сервер отвечает 401, продолжать работу бессмысленно:
// чистим сохранённые данные и отправляем пользователя на страницу входа.
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

// Фильтрацию выполняет сам json-server через query-параметры:
// q — полнотекстовый поиск, date_gte — «дата от», type и city — точное совпадение.
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

// json-server-auth сам проверяет пароль (bcrypt) и возвращает подписанный JWT,
// поэтому клиент никогда не видит и не сравнивает пароли сам.
function saveSession(data) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

// Сервер отвечает строкой вроде "Incorrect password" — переводим её для пользователя.
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

// Кабинет организатора закрыт не только от гостей, но и от посетителей:
// проверка на клиенте — это удобство интерфейса, доступ к данным всё равно
// решает сервер по токену.
function requireRole(role, redirectTo = 'profile.html') {
  requireAuth();
  const user = getCurrentUser();
  if (user && user.role !== role) {
    window.location.href = redirectTo;
  }
}

// Страницы входа и регистрации вошедшему пользователю не нужны
function redirectIfAuthenticated(redirectTo = 'profile.html') {
  if (isAuthenticated()) {
    window.location.href = redirectTo;
  }
}

// Шапка одинакова на всех страницах: гостю показываем кнопки входа,
// вошедшему — меню аккаунта с его именем.
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

// Возврат не удаляет билет, а переводит его в статус «возвращён»:
// так запись остаётся в истории пользователя.
function updateTicketStatus(ticketId, status) {
  return api.patch(`/tickets/${ticketId}`, { status }).then((response) => response.data);
}

function getAllTickets() {
  return api.get('/tickets').then((response) => response.data);
}

function getAllRefunds() {
  return api.get('/refunds').then((response) => response.data);
}

// Отзывы хранятся внутри записи мероприятия, поэтому добавление отзыва —
// это частичное обновление самой записи.
function saveEventReviews(eventId, reviews) {
  return api.patch(`/events/${eventId}`, { reviews }).then((response) => response.data);
}

function createEvent(event) {
  return api.post('/events', event).then((response) => response.data);
}
