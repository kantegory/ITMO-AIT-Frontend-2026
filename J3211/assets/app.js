const mockEvents = [
  {
    id: 1,
    title: 'Live Music Festival 2026',
    type: 'Концерт',
    date: '2026-03-18',
    location: 'Москва',
    place: 'Arena Hall',
    price: 'от 2 500 ₽',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Ночной стендап',
    type: 'Стендап',
    date: '2026-03-20',
    location: 'Санкт-Петербург',
    place: 'Comedy Club Hall',
    price: 'от 1 200 ₽',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Выставка цифрового искусства',
    type: 'Выставка',
    date: '2026-03-25',
    location: 'Казань',
    place: 'Art Space',
    price: 'от 800 ₽',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Премьера спектакля «Гамлет»',
    type: 'Театр',
    date: '2026-03-22',
    location: 'Москва',
    place: 'Большая сцена',
    price: 'от 1 900 ₽',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    title: 'Матч чемпионата',
    type: 'Спорт',
    date: '2026-03-28',
    location: 'Екатеринбург',
    place: 'Central Stadium',
    price: 'от 1 500 ₽',
    image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80'
  }
];

const mockTickets = [
  { id: 101, title: 'Live Music Festival 2026', date: '18.03.2026', location: 'Москва', status: 'Оплачен' },
  { id: 102, title: 'Ночной стендап', date: '20.03.2026', location: 'Санкт-Петербург', status: 'Оплачен' },
  { id: 103, title: 'Выставка цифрового искусства', date: '25.03.2026', location: 'Казань', status: 'Возврат оформлен' }
];

const organizerSeed = [
  { title: 'Весенний джазовый вечер', type: 'Концерт', date: '2026-04-10', location: 'Москва' },
  { title: 'Технологии и искусство', type: 'Выставка', date: '2026-04-17', location: 'Иннополис' }
];

function showAlert(targetId, type, text) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type} mb-0" role="alert">${text}</div>`;
}

function setUpForms() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }
      const email = document.getElementById('loginEmail').value;
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      showAlert('loginAlert', 'success', 'Вход выполнен успешно. Теперь можно перейти в личный кабинет.');
      loginForm.reset();
      loginForm.classList.remove('was-validated');
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        registerForm.classList.add('was-validated');
        return;
      }
      const user = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('registerEmail').value,
        role: document.getElementById('role').value
      };
      localStorage.setItem('registeredUser', JSON.stringify(user));
      showAlert('registerAlert', 'success', 'Регистрация успешно завершена. Данные сохранены в localStorage как имитация API.');
      registerForm.reset();
      registerForm.classList.remove('was-validated');
    });
  }

  const organizerForm = document.getElementById('organizerForm');
  if (organizerForm) {
    organizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!organizerForm.checkValidity()) {
        organizerForm.classList.add('was-validated');
        return;
      }
      const newEvent = {
        title: document.getElementById('orgTitle').value,
        type: document.getElementById('orgType').value,
        date: document.getElementById('orgDate').value,
        location: document.getElementById('orgPlace').value
      };
      const stored = JSON.parse(localStorage.getItem('organizerEvents') || '[]');
      stored.push(newEvent);
      localStorage.setItem('organizerEvents', JSON.stringify(stored));
      renderOrganizerEvents();
      showAlert('organizerAlert', 'success', 'Событие сохранено. Это демонстрация взаимодействия интерфейса с mock API.');
      organizerForm.reset();
      organizerForm.classList.remove('was-validated');
    });
  }
}

function renderEvents(list = mockEvents) {
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

function setupFilters() {
  const applyBtn = document.getElementById('applyFilters');
  const resetBtn = document.getElementById('resetFilters');
  if (!applyBtn || !resetBtn) return;

  applyBtn.addEventListener('click', () => {
    const type = document.getElementById('typeFilter').value.trim();
    const date = document.getElementById('dateFilter').value;
    const location = document.getElementById('locationFilter').value.trim().toLowerCase();

    const filtered = mockEvents.filter(event => {
      const typeMatch = !type || event.type === type;
      const dateMatch = !date || event.date === date;
      const locationMatch = !location || event.location.toLowerCase().includes(location) || event.place.toLowerCase().includes(location);
      return typeMatch && dateMatch && locationMatch;
    });

    renderEvents(filtered);
  });

  resetBtn.addEventListener('click', () => {
    document.getElementById('typeFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('locationFilter').value = '';
    renderEvents(mockEvents);
  });
}

function renderTickets() {
  const ticketsList = document.getElementById('ticketsList');
  if (!ticketsList) return;
  const storedTickets = JSON.parse(localStorage.getItem('tickets') || 'null') || mockTickets;
  ticketsList.innerHTML = storedTickets.map(ticket => `
    <div class="col-md-6">
      <div class="ticket-card h-100">
        <h5 class="fw-bold mb-2">${ticket.title}</h5>
        <p class="mb-1 text-secondary">Дата: ${ticket.date}</p>
        <p class="mb-1 text-secondary">Город: ${ticket.location}</p>
        <p class="mb-3"><span class="badge ${ticket.status === 'Возврат оформлен' ? 'text-bg-secondary' : 'text-bg-success'}">${ticket.status}</span></p>
        <button class="btn btn-outline-danger btn-sm refund-btn" data-id="${ticket.id}" ${ticket.status === 'Возврат оформлен' ? 'disabled' : ''}>Оформить возврат</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.refund-btn').forEach(btn => {
    btn.addEventListener('click', () => openRefundModal(Number(btn.dataset.id), storedTickets));
  });
}

let refundTicketId = null;

function openRefundModal(id, tickets) {
  refundTicketId = id;
  const ticket = tickets.find(item => item.id === id);
  document.getElementById('refundText').textContent = `Вы действительно хотите оформить возврат билета на мероприятие «${ticket.title}»?`;
  const modal = new bootstrap.Modal(document.getElementById('refundModal'));
  modal.show();
}

function setupRefundConfirm() {
  const btn = document.getElementById('confirmRefundBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const tickets = JSON.parse(localStorage.getItem('tickets') || 'null') || mockTickets;
    const updated = tickets.map(ticket => ticket.id === refundTicketId ? { ...ticket, status: 'Возврат оформлен' } : ticket);
    localStorage.setItem('tickets', JSON.stringify(updated));
    renderTickets();
    const modalEl = document.getElementById('refundModal');
    bootstrap.Modal.getInstance(modalEl).hide();
  });
}

function renderOrganizerEvents() {
  const container = document.getElementById('organizerEvents');
  if (!container) return;
  const stored = JSON.parse(localStorage.getItem('organizerEvents') || 'null') || organizerSeed;
  container.innerHTML = stored.map(event => `
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
}

function setupDemoBuy() {
  const btn = document.getElementById('demoBuyBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const tickets = JSON.parse(localStorage.getItem('tickets') || 'null') || mockTickets;
    tickets.push({
      id: Date.now(),
      title: 'Live Music Festival 2026',
      date: '18.03.2026',
      location: 'Москва',
      status: 'Оплачен'
    });
    localStorage.setItem('tickets', JSON.stringify(tickets));
    btn.textContent = 'Билет добавлен';
    btn.disabled = true;
  });
}

function init() {
  setUpForms();
  renderEvents();
  setupFilters();
  renderTickets();
  setupRefundConfirm();
  renderOrganizerEvents();
  setupDemoBuy();
}

document.addEventListener('DOMContentLoaded', init);