let refundModalTicketId = null;

function renderTicketRow(ticket, event) {
  const tr = document.createElement('tr');
  const canRefund = !event.free && ticket.status === 'active';

  tr.innerHTML = `
    <td><a href="event.html?id=${event.id}" class="js-event-title"></a></td>
    <td>${event.dateLabel}</td>
    <td class="js-ticket-category"></td>
    <td><span class="ticket-row__status--${ticket.status}">${ticket.status === 'active' ? 'Активен' : 'Возвращён'}</span></td>
    <td>${
      canRefund
        ? `<button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#refundModal" data-ticket-id="${ticket.id}">Оформить возврат</button>`
        : '—'
    }</td>
  `;

  tr.querySelector('.js-event-title').textContent = event.title;
  tr.querySelector('.js-ticket-category').textContent = ticket.category;
  return tr;
}

function renderRefundRow(refund, event) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="js-event-title"></td>
    <td>${refund.date}</td>
    <td>${refund.amount}</td>
    <td><span class="ticket-row__status--refunded">Возвращено</span></td>
  `;

  tr.querySelector('.js-event-title').textContent = event ? event.title : 'Мероприятие удалено';
  return tr;
}

function statusRow(body, columns, text) {
  body.innerHTML = `<tr><td colspan="${columns}" class="text-muted text-center py-4">${text}</td></tr>`;
}

async function loadTickets(user, events) {
  const body = document.querySelector('.js-tickets-body');
  statusRow(body, 5, 'Загружаем билеты…');

  let tickets;
  try {
    tickets = await getUserTickets(user.id);
  } catch (error) {
    statusRow(body, 5, 'Не удалось загрузить билеты. Проверьте, что json-server запущен (npm run api).');
    return;
  }

  if (tickets.length === 0) {
    statusRow(body, 5, 'Билетов пока нет');
    return;
  }

  body.innerHTML = '';
  tickets.forEach((ticket) => {
    const event = events.find((e) => e.id === ticket.eventId);
    if (!event) return;
    body.appendChild(renderTicketRow(ticket, event));
  });
}

async function loadRefunds(user, events) {
  const body = document.querySelector('.js-refunds-body');

  let refunds;
  try {
    refunds = await getUserRefunds(user.id);
  } catch (error) {
    statusRow(body, 4, 'Не удалось загрузить историю возвратов.');
    return;
  }

  if (refunds.length === 0) {
    statusRow(body, 4, 'Возвратов пока нет');
    return;
  }

  body.innerHTML = '';
  refunds.forEach((refund) => {
    const event = events.find((e) => e.id === refund.eventId);
    body.appendChild(renderRefundRow(refund, event));
  });
}

function initRefundModal(user, events, reload) {
  const modalEl = document.getElementById('refundModal');
  modalEl.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    refundModalTicketId = button.getAttribute('data-ticket-id');
  });

  document.querySelector('.js-confirm-refund').addEventListener('click', async () => {
    if (!refundModalTicketId) return;

    const button = document.querySelector('.js-confirm-refund');
    button.disabled = true;

    try {
      const tickets = await getUserTickets(user.id);
      const ticket = tickets.find((t) => String(t.id) === String(refundModalTicketId));
      if (!ticket) return;

      const event = events.find((e) => e.id === ticket.eventId);

      await createRefund({
        userId: Number(user.id),
        eventId: ticket.eventId,
        amount: event ? event.priceLabel : '',
        date: new Date()
          .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
          .replace(' г.', ''),
      });
      await updateTicketStatus(ticket.id, 'refunded');

      await loadTickets(user, events);
      await loadRefunds(user, events);
    } finally {
      button.disabled = false;
      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    }
  });
}

async function initProfilePage() {
  const ticketsBody = document.querySelector('.js-tickets-body');
  if (!ticketsBody) return;

  requireAuth();
  const user = getCurrentUser();
  if (!user) return;

  document.querySelector('.js-profile-name').value = user.name;
  document.querySelector('.js-profile-email').value = user.email;

  let events;
  try {
    events = await getEvents();
  } catch (error) {
    statusRow(ticketsBody, 5, 'Не удалось связаться с сервером. Проверьте, что json-server запущен (npm run api).');
    return;
  }

  await loadTickets(user, events);
  await loadRefunds(user, events);
  initRefundModal(user, events);
}

document.addEventListener('DOMContentLoaded', initProfilePage);