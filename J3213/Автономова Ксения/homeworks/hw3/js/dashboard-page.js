(() => {
  window.tp = window.tp || {};
  let cachedTickets = [];

  function dedupeTickets(tickets) {
    const deduped = [];
    tickets.forEach((t) => {
      if (!t.seat) {
        deduped.push(t);
        return;
      }
      const idx = deduped.findIndex((d) => d.eventId === t.eventId && d.seat === t.seat);
      if (idx === -1) {
        deduped.push(t);
      } else {
        const current = deduped[idx];
        const hasSeat = !!t.seat;
        const currentHasSeat = !!current.seat;
        const newer = new Date(t.purchaseDate) > new Date(current.purchaseDate);
        if ((hasSeat && !currentHasSeat) || (hasSeat === currentHasSeat && newer)) {
          deduped[idx] = t;
        }
      }
    });
    return deduped;
  }

  window.tp.loadUserDashboard = async function () {
    const listEl = document.getElementById('ticketList');
    const returnedListEl = document.getElementById('returnedList');
    if (!listEl) return;
    if (!localStorage.accessToken) {
      listEl.innerHTML = '<li class="ticket-platform__list-item">Авторизуйтесь для просмотра билетов.</li>';
      if (returnedListEl) {
        returnedListEl.innerHTML = '';
      }
      return;
    }
    try {
      const events = await window.api.getEvents();
      let tickets = [];
      try {
        tickets = await window.api.getTickets();
        tickets = dedupeTickets(tickets);
        cachedTickets = tickets.slice();
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('private resource access')) {
          tickets = [];
          cachedTickets = [];
        } else {
          console.error(err);
          listEl.innerHTML = '<li class="ticket-platform__list-item">Ошибка загрузки данных.</li>';
          if (returnedListEl) returnedListEl.innerHTML = '';
          return;
        }
      }
      let returns = [];
      try {
        returns = await window.api.getReturns();
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('private resource access')) {
          returns = [];
        } else {
          console.error(err);
          listEl.innerHTML = '<li class="ticket-platform__list-item">Ошибка загрузки данных.</li>';
          if (returnedListEl) returnedListEl.innerHTML = '';
          return;
        }
      }
      listEl.innerHTML = '';
      if (tickets.length === 0) {
        listEl.innerHTML = '<li class="ticket-platform__list-item">Вы ещё не купили билеты.</li>';
      } else {
        tickets.forEach((t, index) => {
          const li = document.createElement('li');
          li.className = 'ticket-platform__list-item d-flex justify-content-between align-items-start flex-wrap';
          const evt = events.find((e) => e.id === t.eventId) || {};
          const seatInfo = t.seat ? `, место ${t.seat}` : '';
          li.innerHTML = `<div class="me-2">
              <strong>${evt.title || 'Мероприятие'}</strong><br><span>${evt.date || ''} - ${evt.location || ''}${seatInfo}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger mt-2 mt-md-0" onclick="tp.returnTicket(${index})">Вернуть</button>`;
          listEl.appendChild(li);
        });
      }
      if (returnedListEl) {
        returnedListEl.innerHTML = '';
        if (returns.length === 0) {
          returnedListEl.innerHTML = '<li class="ticket-platform__list-item">Нет возвращённых билетов.</li>';
        } else {
          returns.forEach((rt) => {
            const li = document.createElement('li');
            li.className = 'ticket-platform__list-item';
            const evt = events.find((e) => e.id === rt.eventId) || {};
            const seatInfoR = rt.seat ? `, место ${rt.seat}` : '';
            li.innerHTML = `<div><strong>${evt.title || 'Мероприятие'}</strong><br><span>${evt.date || ''} - ${evt.location || ''}${seatInfoR}</span></div>`;
            returnedListEl.appendChild(li);
          });
        }
      }
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<li class="ticket-platform__list-item">Ошибка загрузки данных.</li>';
      if (returnedListEl) returnedListEl.innerHTML = '';
    }
  };

  window.tp.returnTicket = async function (index) {
    try {
      const ticket = cachedTickets[index];
      if (!ticket) return;
      await window.api.deleteTicket(ticket.id);
      const currentUser = JSON.parse(localStorage.user || '{}');
      const returnData = {
        eventId: ticket.eventId,
        seat: ticket.seat || null,
        returnDate: new Date().toISOString(),
        userId: currentUser.id
      };
      await window.api.createReturn(returnData);
      await window.tp.loadUserDashboard();
    } catch (err) {
      alert(err.message || 'Не удалось вернуть билет');
    }
  };
})();