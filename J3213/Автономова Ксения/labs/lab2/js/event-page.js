(() => {
  window.tp = window.tp || {};
  let selectedSeatRemote = null;
  let selectedSeatElRemote = null;

  function updateSeatInfo() {
    const info = document.getElementById('selectedSeatInfo');
    if (!info) return;
    if (selectedSeatRemote) {
      info.textContent = `Вы выбрали место ${selectedSeatRemote}`;
    } else {
      info.textContent = 'Выберите место на схеме';
    }
  }

  async function renderHall(evt) {
    const hall = document.getElementById('seatMap');
    const section = document.getElementById('seatSection');
    if (!hall || !section) return;
    selectedSeatRemote = null;
    selectedSeatElRemote = null;
    if (evt.type !== 'Концерт') {
      section.style.display = 'none';
      hall.innerHTML = '';
      hall.style.display = 'none';
      updateSeatInfo();
      return;
    }
    section.style.display = 'block';
    hall.style.display = 'grid';
    hall.innerHTML = '';
    let soldSeats = [];
    let returnedSeats = [];
    try {
      soldSeats = await window.api.getTicketsByEvent(evt.id);
    } catch (err) {
      soldSeats = [];
    }
    try {
      returnedSeats = await window.api.getReturnsByEvent(evt.id);
    } catch (err) {
      returnedSeats = [];
    }
    const taken = soldSeats
      .filter((t) => t.seat && !returnedSeats.some((r) => r.seat === t.seat))
      .map((t) => t.seat);
    for (let i = 0; i < 100; i++) {
      const seatNum = String(i + 1);
      const seatDiv = document.createElement('div');
      seatDiv.dataset.seat = seatNum;
      if (taken.includes(seatNum)) {
        seatDiv.className = 'ticket-platform__seat ticket-platform__seat--taken';
      } else {
        seatDiv.className = 'ticket-platform__seat';
        seatDiv.addEventListener('click', () => {
          const clicked = seatDiv.dataset.seat;
          if (selectedSeatRemote && selectedSeatRemote === clicked) {
            if (selectedSeatElRemote) {
              selectedSeatElRemote.classList.remove('ticket-platform__seat--selected');
            }
            selectedSeatRemote = null;
            selectedSeatElRemote = null;
            updateSeatInfo();
            return;
          }
          if (selectedSeatElRemote) {
            selectedSeatElRemote.classList.remove('ticket-platform__seat--selected');
          }
          selectedSeatRemote = clicked;
          selectedSeatElRemote = seatDiv;
          seatDiv.classList.add('ticket-platform__seat--selected');
          updateSeatInfo();
        });
      }
      hall.appendChild(seatDiv);
    }
    updateSeatInfo();
  }

  async function renderReviews(eventId) {
    try {
      const reviews = await window.api.getReviews(eventId);
      const container = document.getElementById('reviewList');
      if (container) {
        container.innerHTML = '';
        if (!reviews || reviews.length === 0) {
          container.innerHTML = '<p class="text-muted">Отзывов пока нет.</p>';
        } else {
          reviews.forEach((rev) => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `<strong>${rev.author}</strong><br><span>${rev.text}</span>`;
            container.appendChild(div);
          });
        }
      }
      const form = document.getElementById('reviewForm');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const params = new URLSearchParams(window.location.search);
          const eid = parseInt(params.get('id'), 10);
          window.tp.submitReview(eid);
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  window.tp.loadEvent = async function () {
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'), 10);
    if (!eventId) return;

    try {
      const evt = await window.api.getEventById(eventId);
      if (!evt) return;

      const currentRole = localStorage.userType || '';
      const buyButton = document.getElementById('buyButton');

      if (buyButton && currentRole === 'organizer') {
        buyButton.disabled = true;
        buyButton.textContent = 'Организатор не может покупать билеты';
        buyButton.classList.remove('btn-success');
        buyButton.classList.add('btn-secondary');
      }

      const titleEl = document.getElementById('eventTitle');
      const imgEl = document.getElementById('eventImage');
      const typeEl = document.getElementById('eventType');
      const dateEl = document.getElementById('eventDate');
      const locEl = document.getElementById('eventLocation');
      const descEl = document.getElementById('eventDesc');
      const priceEl = document.getElementById('eventPrice');

      if (titleEl) titleEl.textContent = evt.title || '';
      if (imgEl) imgEl.src = evt.poster || '';
      if (typeEl) typeEl.textContent = evt.type || '';
      if (dateEl) dateEl.textContent = evt.date || '';
      if (locEl) locEl.textContent = evt.location || '';
      if (descEl) descEl.textContent = evt.description || '';
      if (priceEl) priceEl.textContent = evt.price ? `${evt.price} ₽` : '';

      await renderHall(evt);
      await renderReviews(eventId);
    } catch (err) {
      console.error(err);
    }
  };

  window.tp.buyTicket = async function () {
    try {
      const params = new URLSearchParams(window.location.search);
      const eventId = parseInt(params.get('id'), 10);
      if (!eventId) return;

      const currentRole = localStorage.userType || '';
      if (currentRole === 'organizer') {
        alert('Организатор не может покупать билеты');
        return;
      }

      const evt = await window.api.getEventById(eventId);
      if (!evt) {
        alert('Мероприятие не найдено');
        return;
      }

      if (evt.type === 'Концерт' && !selectedSeatRemote) {
        alert('Выберите место для покупки');
        return;
      }

      const currentUser = JSON.parse(localStorage.user || '{}');
      const ticketData = {
        eventId,
        seat: evt.type === 'Концерт' ? selectedSeatRemote : null,
        purchaseDate: new Date().toISOString(),
        userId: currentUser.id
      };

      await window.api.createTicket(ticketData);

      const alertBox = document.getElementById('purchaseAlert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.textContent = `Билет на «${evt.title}» успешно приобретён! Его можно посмотреть в разделе «Мои билеты».`;
      }

      if (selectedSeatElRemote) {
        selectedSeatElRemote.classList.remove('ticket-platform__seat--selected');
      }
      selectedSeatRemote = null;
      selectedSeatElRemote = null;
      updateSeatInfo();

      await renderHall(evt);
    } catch (err) {
      alert(err.message || 'Не удалось приобрести билет');
    }
  };

  window.tp.submitReview = async function (eventId) {
    const authorInput = document.getElementById('reviewAuthor');
    const textInput = document.getElementById('reviewText');
    const author = authorInput && authorInput.value.trim() ? authorInput.value.trim() : 'Аноним';
    const text = textInput ? textInput.value.trim() : '';
    if (!text) return;
    try {
      const currentUser = JSON.parse(localStorage.user || '{}');
      const review = {
        eventId,
        author,
        text,
        date: new Date().toLocaleDateString('ru-RU'),
        userId: currentUser.id
      };
      await window.api.createReview(review);
      if (authorInput) authorInput.value = '';
      if (textInput) textInput.value = '';
      await renderReviews(eventId);
    } catch (err) {
      alert(err.message || 'Не удалось отправить отзыв');
    }
  };
})();