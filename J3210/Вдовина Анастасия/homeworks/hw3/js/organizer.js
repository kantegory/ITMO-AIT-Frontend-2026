function renderOrganizerEventRow(event, ticketCount) {
  const tr = document.createElement('tr');
  const soldLabel = event.free ? `${ticketCount} записалось` : `${ticketCount} продано`;

  tr.innerHTML = `
    <td><a href="event.html?id=${event.id}" class="js-event-title"></a></td>
    <td>${event.dateLabel}</td>
    <td>${soldLabel}</td>
    <td><span class="badge text-bg-success">${event.free ? 'Регистрация открыта' : 'Продажи открыты'}</span></td>
    <td>
      <button type="button" class="btn btn-sm btn-outline-secondary">Редактировать</button>
      <button type="button" class="btn btn-sm btn-outline-danger">Отменить</button>
    </td>
  `;

  tr.querySelector('.js-event-title').textContent = event.title;
  return tr;
}

async function loadOrganizerEvents() {
  const body = document.querySelector('.js-organizer-events-body');
  body.innerHTML = '<tr><td colspan="5" class="text-muted text-center py-4">Загружаем данные…</td></tr>';

  let events;
  let tickets;
  let refunds;
  try {
    [events, tickets, refunds] = await Promise.all([getEvents(), getAllTickets(), getAllRefunds()]);
  } catch (error) {
    body.innerHTML = '<tr><td colspan="5" class="text-danger text-center py-4">Не удалось загрузить данные. Проверьте, что json-server запущен (npm run api).</td></tr>';
    return;
  }

  if (events.length === 0) {
    body.innerHTML = '<tr><td colspan="5" class="text-muted text-center py-4">Мероприятий пока нет</td></tr>';
  } else {
    body.innerHTML = '';
    events.forEach((event) => {
      const count = tickets.filter((t) => t.eventId === event.id && t.status === 'active').length;
      body.appendChild(renderOrganizerEventRow(event, count));
    });
  }

  const revenue = tickets.reduce((sum, ticket) => {
    const event = events.find((e) => e.id === ticket.eventId);
    const isPaidAndActive = event && !event.free && ticket.status === 'active';
    return sum + (isPaidAndActive ? event.priceFrom : 0);
  }, 0);

  document.querySelector('.js-stat-events').textContent = events.length;
  document.querySelector('.js-stat-tickets').textContent = tickets.filter((t) => t.status === 'active').length;
  document.querySelector('.js-stat-revenue').textContent = `${revenue.toLocaleString('ru-RU')} ₽`;
  document.querySelector('.js-stat-refunds').textContent = refunds.length;
}

function initCreateEventForm() {
  const button = document.querySelector('.js-create-event');
  const errorBox = document.querySelector('.js-create-error');

  button.addEventListener('click', async () => {
    errorBox.classList.add('d-none');

    const title = document.getElementById('eventTitle').value.trim();
    const type = document.getElementById('eventType').value;
    const venue = document.getElementById('eventVenue').value.trim();
    const date = document.getElementById('eventDate').value;
    const price = Number(document.getElementById('eventPrice').value) || 0;
    const description = document.getElementById('eventDescription').value.trim();

    if (!title || !venue || !date) {
      errorBox.textContent = 'Заполните название, место проведения и дату.';
      errorBox.classList.remove('d-none');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slug || 'event'}-${Date.now()}`;

    const dateObj = new Date(date);
    const dateLabel = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

    const newEvent = {
      id,
      title,
      type,
      typeLabel: type === 'festival' ? 'Фестиваль' : 'Концерт',
      city: 'spb',
      cityLabel: 'Санкт-Петербург',
      date,
      dateLabel,
      timeLabel: null,
      venueShort: venue,
      venueFull: venue,
      image: 'img/vselennaya.jpeg',
      free: price === 0,
      priceFrom: price,
      priceLabel: price === 0 ? 'Бесплатно' : `от ${price.toLocaleString('ru-RU')} ₽`,
      badges: [type === 'festival' ? 'Фестиваль' : 'Концерт', price === 0 ? 'Бесплатно' : 'Платно'],
      description: description || 'Описание появится позже.',
      venueDescription: venue,
      venueMapLabel: 'Схема зала уточняется',
      priceTiers: [],
      reviews: [],
    };

    try {
      await createEvent(newEvent);
      document.querySelector('form').reset();
      bootstrap.Modal.getOrCreateInstance(document.getElementById('createEventModal')).hide();
      await loadOrganizerEvents();
    } catch (error) {
      errorBox.textContent = 'Не удалось создать мероприятие. Проверьте, что json-server запущен (npm run api).';
      errorBox.classList.remove('d-none');
    }
  });
}

async function initOrganizerPage() {
  const body = document.querySelector('.js-organizer-events-body');
  if (!body) return;

  requireRole('organizer');
  const user = getCurrentUser();
  if (!user || user.role !== 'organizer') return;

  await loadOrganizerEvents();
  initCreateEventForm();
}

document.addEventListener('DOMContentLoaded', initOrganizerPage);