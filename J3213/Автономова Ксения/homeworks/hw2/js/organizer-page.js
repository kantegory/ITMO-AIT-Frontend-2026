(() => {
  window.tp = window.tp || {};

  window.tp.loadOrganizerDashboard = async function () {
    const listEl = document.getElementById('orgEventList');
    if (!listEl) return;
    if (!localStorage.accessToken || !localStorage.user) {
      listEl.innerHTML = '<li class="ticket-platform__list-item">Авторизуйтесь как организатор для просмотра мероприятий.</li>';
      return;
    }
    const currentUser = JSON.parse(localStorage.user);
    try {
      const events = await window.api.getUserEvents(currentUser.id);
      listEl.innerHTML = '';
      if (!events || events.length === 0) {
        listEl.innerHTML = '<li class="ticket-platform__list-item">У вас пока нет созданных мероприятий.</li>';
      } else {
        for (const evt of events) {
          let soldCount = 0;
          let returnCount = 0;
          try {
            const soldList = await window.api.getTicketsByEvent(evt.id);
            soldCount = Array.isArray(soldList) ? soldList.length : 0;
          } catch (err) {
            if (!err.message || !err.message.toLowerCase().includes('private resource access')) {
              throw err;
            }
          }
          try {
            const returnedList = await window.api.getReturnsByEvent(evt.id);
            returnCount = Array.isArray(returnedList) ? returnedList.length : 0;
          } catch (err) {
            if (!err.message || !err.message.toLowerCase().includes('private resource access')) {
              throw err;
            }
          }
          const li = document.createElement('li');
          li.className = 'ticket-platform__list-item d-flex justify-content-between align-items-center flex-wrap';
          li.innerHTML = `<div class="me-2">
              <strong>${evt.title}</strong><br>
              <span>${evt.date} - ${evt.location}</span><br>
              <small class="text-muted">Продано: ${soldCount}, Возвраты: ${returnCount}</small>
            </div>`;
          listEl.appendChild(li);
        }
      }
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<li class="ticket-platform__list-item">Ошибка загрузки данных.</li>';
    }
  };

  window.tp.createEventFromForm = async function (e) {
    e.preventDefault();
    try {
      const title = document.getElementById('newEventTitle').value;
      const type = document.getElementById('newEventType').value;
      const date = document.getElementById('newEventDate').value;
      const location = document.getElementById('newEventLocation').value;
      const price = parseFloat(document.getElementById('newEventPrice').value);
      const desc = document.getElementById('newEventDesc').value;
      const poster = document.getElementById('newEventPoster').value || '';
      const currentUser = JSON.parse(localStorage.user || '{}');
      const newEvent = {
        title,
        type,
        date,
        location,
        price,
        description: desc,
        poster,
        userId: currentUser.id
      };
      await window.api.createEvent(newEvent);
      e.target.reset();
      if (typeof window.tp.toggleCreateForm === 'function') {
        window.tp.toggleCreateForm();
      }
      await window.tp.loadOrganizerDashboard();
    } catch (err) {
      alert(err.message || 'Не удалось создать мероприятие');
    }
  };
})();