const API_URL = 'http://localhost:3000';

function showAlert(targetId, type, text) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type} mb-0" role="alert">${text}</div>`;
}

async function fetchEvents() {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) throw new Error('Не удалось загрузить мероприятия');
  return await response.json();
}

function renderEvents(list) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<div class="col-12"><div class="alert alert-warning">По заданным фильтрам ничего не найдено.</div></div>';
    return;
  }

  grid.innerHTML = list.map(event => `
    <div class="col-md-6 col-xl-4">
      <div class="card event-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
        <img src="${event.image}" alt="${event.title}">
        <div class="card-body d-flex flex-column p-4">
          <div class="d-flex gap-2 flex-wrap mb-2">
            <span class="badge text-bg-primary">${event.type}</span>
            <span class="badge text-bg-light">${event.location}</span>
          </div>
          <h5 class="fw-bold">${event.title}</h5>
          <p class="text-secondary mb-2">${event.place}</p>
          <p class="text-secondary">${event.date} · ${event.price}</p>
          <a href="event.html" class="btn btn-outline-primary mt-auto">Подробнее</a>
        </div>
      </div>
    </div>
  `).join('');
}

async function setupFilters() {
  const applyBtn = document.getElementById('applyFilters');
  const resetBtn = document.getElementById('resetFilters');
  const grid = document.getElementById('eventsGrid');
  if (!applyBtn || !resetBtn || !grid) return;

  let allEvents = [];

  try {
    allEvents = await fetchEvents();
    renderEvents(allEvents);
  } catch {
    grid.innerHTML = '<div class="col-12"><div class="alert alert-danger">Ошибка загрузки мероприятий.</div></div>';
    return;
  }

  applyBtn.addEventListener('click', () => {
    const type = document.getElementById('typeFilter').value.trim();
    const date = document.getElementById('dateFilter').value;
    const location = document.getElementById('locationFilter').value.trim().toLowerCase();

    const filtered = allEvents.filter(event => {
      const typeMatch = !type || event.type === type;
      const dateMatch = !date || event.date === date;
      const locationMatch =
        !location ||
        event.location.toLowerCase().includes(location) ||
        event.place.toLowerCase().includes(location);

      return typeMatch && dateMatch && locationMatch;
    });

    renderEvents(filtered);
  });

  resetBtn.addEventListener('click', () => {
    document.getElementById('typeFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('locationFilter').value = '';
    renderEvents(allEvents);
  });
}

async function setupRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!registerForm.checkValidity()) {
      registerForm.classList.add('was-validated');
      return;
    }

    const user = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('registerEmail').value,
      password: document.getElementById('registerPassword').value,
      role: document.getElementById('role').value
    };

    try {
      const checkResponse = await fetch(`${API_URL}/users?email=${encodeURIComponent(user.email)}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        showAlert('registerAlert', 'danger', 'Пользователь с таким email уже существует.');
        return;
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error();

      showAlert('registerAlert', 'success', 'Регистрация успешно завершена.');
      registerForm.reset();
      registerForm.classList.remove('was-validated');
    } catch {
      showAlert('registerAlert', 'danger', 'Ошибка при регистрации.');
    }
  });
}

async function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!loginForm.checkValidity()) {
      loginForm.classList.add('was-validated');
      return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await response.json();

      if (users.length === 0) {
        showAlert('loginAlert', 'danger', 'Неверный email или пароль.');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(users[0]));
      showAlert('loginAlert', 'success', 'Вход выполнен успешно.');
      loginForm.reset();
      loginForm.classList.remove('was-validated');
    } catch {
      showAlert('loginAlert', 'danger', 'Ошибка при входе.');
    }
  });
}

async function renderTickets() {
  const ticketsList = document.getElementById('ticketsList');
  if (!ticketsList) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    ticketsList.innerHTML = '<div class="col-12"><div class="alert alert-warning">Сначала выполните вход.</div></div>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tickets?userId=${currentUser.id}`);
    const tickets = await response.json();

    ticketsList.innerHTML = tickets.map(ticket => `
      <div class="col-md-6">
        <div class="ticket-card h-100">
          <h5 class="fw-bold mb-2">${ticket.title}</h5>
          <p class="mb-1 text-secondary">Дата: ${ticket.date}</p>
          <p class="mb-1 text-secondary">Город: ${ticket.location}</p>
          <p class="mb-3">
            <span class="badge ${ticket.status === 'Возврат оформлен' ? 'text-bg-secondary' : 'text-bg-success'}">
              ${ticket.status}
            </span>
          </p>
        </div>
      </div>
    `).join('');
  } catch {
    ticketsList.innerHTML = '<div class="col-12"><div class="alert alert-danger">Ошибка загрузки билетов.</div></div>';
  }
}

async function setupOrganizerForm() {
  const organizerForm = document.getElementById('organizerForm');
  if (!organizerForm) return;

  organizerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!organizerForm.checkValidity()) {
      organizerForm.classList.add('was-validated');
      return;
    }

    const newEvent = {
      title: document.getElementById('orgTitle').value,
      type: document.getElementById('orgType').value,
      date: document.getElementById('orgDate').value,
      location: document.getElementById('orgPlace').value,
      description: document.getElementById('orgDescription').value
    };

    try {
      const response = await fetch(`${API_URL}/organizerEvents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) throw new Error();

      showAlert('organizerAlert', 'success', 'Событие успешно сохранено на mock API.');
      organizerForm.reset();
      organizerForm.classList.remove('was-validated');
      renderOrganizerEvents();
    } catch {
      showAlert('organizerAlert', 'danger', 'Ошибка сохранения события.');
    }
  });
}

async function renderOrganizerEvents() {
  const container = document.getElementById('organizerEvents');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/organizerEvents`);
    const events = await response.json();

    container.innerHTML = events.map(event => `
      <div class="col-md-6">
        <div class="organizer-event-card h-100">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 class="fw-bold mb-0">${event.title}</h5>
            <span class="badge text-bg-primary">${event.type}</span>
          </div>
          <p class="text-secondary mb-1">Дата: ${event.date}</p>
          <p class="text-secondary mb-0">Город: ${event.location}</p>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Ошибка загрузки событий.</div></div>';
  }
}

function init() {
  setupFilters();
  setupRegisterForm();
  setupLoginForm();
  renderTickets();
  setupOrganizerForm();
  renderOrganizerEvents();
}

document.addEventListener('DOMContentLoaded', init);