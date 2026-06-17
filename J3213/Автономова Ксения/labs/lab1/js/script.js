(() => {
  const SAMPLE_EVENTS = [
    {
      id: 1,
      title: "Концерт в филармонии",
      type: "Концерт",
      date: "2026-05-20",
      location: "Михайловская ул., 2/9, Центральный район, Санкт-Петербург",
      description:
        "Вечер симфонической музыки в знаменитой Санкт‑Петербургской филармонии. Прозвучат произведения русских классиков.",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Philharmonics_Hall_SPB.jpg/960px-Philharmonics_Hall_SPB.jpg",
      price: 1500
    },
      {
      id: 2,
      title: "Джазовый вечер в Октябрьском",
      type: "Концерт",
      date: "2026-06-10",
      location: "Лиговский проспект, дом 6, Санкт‑Петербург",
      description:
        "Большой концертный зал “Октябрьский” приглашает на джазовый вечер с участием ведущих российских музыкантов.",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Oktyabrskiy_Grand_Concert_Hall.jpg/960px-Oktyabrskiy_Grand_Concert_Hall.jpg",
      price: 1800
    },
    {
      id: 3,
      title: "Прогулка на катере по Неве",
      type: "Экскурсия",
      date: "2026-07-05",
      location: "Причал на Дворцовой набережной, Санкт-Петербург",
      description:
        "Вечерняя прогулка на катере по Большой Неве. Во время экскурсии вы увидите Стрелку Васильевского острова, Петропавловскую крепость, Кунсткамеру и другие достопримечательности Петербурга.",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Boats_on_Big_Neva_river.jpg/960px-Boats_on_Big_Neva_river.jpg",
      price: 1000
    }
  ];

  function getEvents() {
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.warn("Could not parse stored events", err);
      }
    }
    return SAMPLE_EVENTS.slice();
  }

  function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
  }

  function getCurrentUserEmail() {
    return "";
  }

  function getTickets() {
    const stored = localStorage.getItem("tickets");
    return stored ? JSON.parse(stored) : [];
  }

  function saveTickets(tickets) {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }

  let selectedSeat = null;

  let selectedSeatElement = null;

  function renderEventCards(container, events) {
    container.innerHTML = "";
    if (events.length === 0) {

      container.innerHTML =
        '<p class="text-center mt-4">По вашему запросу ничего не найдено.</p>';
      return;
    }
    events.forEach(evt => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
        <div class="card ticket-platform__card h-100">
          <img src="${evt.poster}" class="ticket-platform__event-image card-img-top" alt="${evt.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${evt.title}</h5>
            <p class="mb-2"><strong>Тип:</strong> ${evt.type}</p>
            <p class="mb-2"><strong>Дата:</strong> ${evt.date}</p>
            <p class="mb-2"><strong>Место:</strong> ${evt.location}</p>
            <p class="card-text ticket-platform__text-truncate">${evt.description}</p>
            <div class="mt-auto">
              <a href="event.html?id=${evt.id}" class="btn btn-primary w-100">Подробнее</a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function applyFilters() {
    const typeSelect = document.getElementById("filterType");
    const dateInput = document.getElementById("filterDate");
    const locInput = document.getElementById("filterLocation");
    const events = getEvents();
    const filtered = events.filter(evt => {
      const typeMatch =
        !typeSelect || typeSelect.value === "" || evt.type === typeSelect.value;
      const dateMatch = !dateInput || dateInput.value === "" ||
        evt.date >= dateInput.value;
      const locMatch =
        !locInput || locInput.value === "" ||
        evt.location.toLowerCase().includes(locInput.value.toLowerCase());
      return typeMatch && dateMatch && locMatch;
    });
    const resultsContainer = document.getElementById("searchResults");
    renderEventCards(resultsContainer, filtered);
  }

  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  function loadEvent() {
    const eventId = parseInt(getQueryParam("id"), 10);
    const events = getEvents();
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    document.getElementById("eventTitle").textContent = evt.title;
    document.getElementById("eventImage").src = evt.poster;
    document.getElementById("eventType").textContent = evt.type;
    document.getElementById("eventDate").textContent = evt.date;
    document.getElementById("eventLocation").textContent = evt.location;
    document.getElementById("eventDesc").textContent = evt.description;

    document.getElementById("eventPrice").textContent = `${evt.price} ₽`;

    renderHall(evt);

    renderReviews(eventId);
    updateSeatInfo();
  }

  function buyTicket() {
    const eventId = parseInt(getQueryParam("id"), 10);
    const events = getEvents();
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;
    const tickets = getTickets();
    tickets.push({ ...evt, purchaseDate: new Date().toISOString(), seat: selectedSeat });
    saveTickets(tickets);

    const alertBox = document.getElementById("purchaseAlert");
    alertBox.classList.remove("d-none");
    alertBox.textContent = `Билет на «${evt.title}» успешно приобретён! Его можно посмотреть в разделе «Мои билеты».`;

    const buyBtn = document.getElementById("buyButton");
    if (buyBtn) buyBtn.disabled = true;

    if (selectedSeatElement) {
      selectedSeatElement.classList.remove("ticket-platform__seat--selected");
    }
    selectedSeat = null;
    selectedSeatElement = null;
    updateSeatInfo();
  }

  function hideOrganizerLinks() {
    const type = localStorage.getItem("userType");

    const orgLinks = document.querySelectorAll('a[href="organizer.html"]');
    if (type !== "organizer" && orgLinks.length > 0) {
      orgLinks.forEach(link => {

        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.style.display = "none";
        } else {
          link.style.display = "none";
        }
      });
    }
  }

  function hideUserLinks() {
    const type = localStorage.getItem("userType");
    if (type === "organizer") {
      const userLinks = document.querySelectorAll('a[href="dashboard.html"]');
      userLinks.forEach(link => {
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.style.display = "none";
        } else {
          link.style.display = "none";
        }
      });
    }
  }

  function getReturnedTickets() {
    const stored = localStorage.getItem("returnedTickets");
    return stored ? JSON.parse(stored) : [];
  }

  function saveReturnedTickets(tickets) {
    localStorage.setItem("returnedTickets", JSON.stringify(tickets));
  }

  function getAllTickets() {

    return getTickets();
  }

  function getAllReturnedTickets() {

    return getReturnedTickets();
  }

  function requireOrganizer() {
    const type = localStorage.getItem("userType");
    if (type !== "organizer") {
      window.location.href = "dashboard.html";
    }
  }

  function returnTicket(index) {
    const tickets = getTickets();
    if (index >= 0 && index < tickets.length) {

      const [returned] = tickets.splice(index, 1);
      saveTickets(tickets);
      const returnedTickets = getReturnedTickets();
      returnedTickets.push(returned);
      saveReturnedTickets(returnedTickets);
    }
    loadUserDashboard();
  }

  function loadUserDashboard() {
    const tickets = getTickets();
    const returned = getReturnedTickets();
    const listEl = document.getElementById("ticketList");
    const returnedListEl = document.getElementById("returnedList");
    if (!listEl) return;

    listEl.innerHTML = "";
    if (tickets.length === 0) {
      listEl.innerHTML = '<li class="ticket-platform__list-item">Вы ещё не купили билеты.</li>';
    } else {
      tickets.forEach((t, index) => {
        const li = document.createElement("li");
        li.className = "ticket-platform__list-item d-flex justify-content-between align-items-start flex-wrap";
        const seatInfo = t.seat ? `, место ${t.seat}` : "";
        li.innerHTML = `<div class="me-2">
            <strong>${t.title}</strong><br><span>${t.date} - ${t.location}${seatInfo}</span>
          </div>
          <button class="btn btn-sm btn-outline-danger mt-2 mt-md-0" onclick="tp.returnTicket(${index})">Вернуть</button>`;
        listEl.appendChild(li);
      });
    }

    if (returnedListEl) {
      returnedListEl.innerHTML = "";
      if (returned.length === 0) {
        returnedListEl.innerHTML = '<li class="ticket-platform__list-item">Нет возвращённых билетов.</li>';
      } else {
        returned.forEach(rt => {
          const li = document.createElement("li");
          li.className = "ticket-platform__list-item";
          const seatInfoR = rt.seat ? `, место ${rt.seat}` : "";
          li.innerHTML = `<div><strong>${rt.title}</strong><br><span>${rt.date} - ${rt.location}${seatInfoR}</span></div>`;
          returnedListEl.appendChild(li);
        });
      }
    }
  }

  function loadOrganizerDashboard() {
    const events = getEvents();

    const tickets = getTickets();
    const returned = getReturnedTickets();
    const listEl = document.getElementById("orgEventList");
    if (!listEl) return;
    listEl.innerHTML = "";
    if (events.length === 0) {
      listEl.innerHTML = '<li class="ticket-platform__list-item">У вас пока нет созданных мероприятий.</li>';
    } else {
      events.forEach(evt => {
        const li = document.createElement("li");
        li.className = "ticket-platform__list-item d-flex justify-content-between align-items-center flex-wrap";

        const soldCount = tickets.filter(t => t.id === evt.id).length;
        const returnCount = returned.filter(t => t.id === evt.id).length;

        li.innerHTML = `<div class="me-2">
            <strong>${evt.title}</strong><br>
            <span>${evt.date} - ${evt.location}</span><br>
            <small class="text-muted">Продано: ${soldCount}, Возвраты: ${returnCount}</small>
          </div>`;
        listEl.appendChild(li);
      });
    }
  }

  function createEventFromForm(event) {
    event.preventDefault();

    const title = document.getElementById("newEventTitle").value;
    const type = document.getElementById("newEventType").value;
    const date = document.getElementById("newEventDate").value;
    const location = document.getElementById("newEventLocation").value;
    const price = parseFloat(document.getElementById("newEventPrice").value);
    const desc = document.getElementById("newEventDesc").value;
    const poster = document.getElementById("newEventPoster").value ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Philharmonics_Hall_SPB.jpg/960px-Philharmonics_Hall_SPB.jpg";
    const events = getEvents();
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const newEvent = { id: newId, title, type, date, location, description: desc, poster, price };
    events.push(newEvent);
    saveEvents(events);

    event.target.reset();

    if (typeof toggleCreateForm === 'function') {
      toggleCreateForm();
    }

    loadOrganizerDashboard();
  }

  function toggleCreateForm() {
    const container = document.getElementById("createEventFormContainer");
    if (!container) return;
    if (container.style.display === "none" || container.style.display === "") {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  }

  function renderHall(evt) {
    const hall = document.getElementById("seatMap");
    const section = document.getElementById("seatSection");
    if (!hall || !section) return;

    if (evt.type !== "Концерт") {
      section.style.display = "none";
      hall.innerHTML = "";
      hall.style.display = "none";

      selectedSeat = null;
      selectedSeatElement = null;
      return;
    }

    section.style.display = "block";
    hall.style.display = "grid";
    hall.innerHTML = "";
    for (let i = 0; i < 100; i++) {
      const seat = document.createElement("div");
      seat.className = "ticket-platform__seat";
      seat.dataset.seat = i + 1;
      seat.addEventListener("click", () => {
        const seatNum = seat.dataset.seat;

        if (selectedSeat && selectedSeat === seatNum) {
          if (selectedSeatElement) {
            selectedSeatElement.classList.remove("ticket-platform__seat--selected");
          }
          selectedSeat = null;
          selectedSeatElement = null;
          updateSeatInfo();
          return;
        }

        if (selectedSeatElement) {
          selectedSeatElement.classList.remove("ticket-platform__seat--selected");
        }
        selectedSeat = seatNum;
        selectedSeatElement = seat;
        seat.classList.add("ticket-platform__seat--selected");
        updateSeatInfo();
      });
      hall.appendChild(seat);
    }
    updateSeatInfo();
  }

  function updateSeatInfo() {
    const info = document.getElementById("selectedSeatInfo");
    if (!info) return;
    if (selectedSeat) {
      info.textContent = `Вы выбрали место ${selectedSeat}`;
    } else {
      info.textContent = "Выберите место на схеме";
    }
  }

  function getReviews(eventId) {
    const key = `reviews_${eventId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.warn("Could not parse stored reviews", err);
      }
    }

    return [
      {
        author: "Автономова Ксения",
        text: "Отличное мероприятие!",
        date: new Date().toLocaleDateString("ru-RU")
      }
    ];
  }

  function saveReviews(eventId, reviews) {
    const key = `reviews_${eventId}`;
    localStorage.setItem(key, JSON.stringify(reviews));
  }

  function renderReviews(eventId) {
    const reviews = getReviews(eventId);
    const container = document.getElementById("reviewList");
    if (!container) return;
    container.innerHTML = "";
    reviews.forEach(review => {
      const div = document.createElement("div");
      div.className = "mb-3";
      div.innerHTML = `<strong>${review.author}</strong><br><span>${review.text}</span>`;
      container.appendChild(div);
    });

    const form = document.getElementById("reviewForm");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        submitReview(eventId);
      };
    }
  }

  function submitReview(eventId) {
    const authorInput = document.getElementById("reviewAuthor");
    const textInput = document.getElementById("reviewText");
    const author = authorInput && authorInput.value.trim() ? authorInput.value.trim() : "Аноним";
    const text = textInput ? textInput.value.trim() : "";
    if (!text) return;
    const reviews = getReviews(eventId);
    reviews.push({ author, text, date: new Date().toLocaleDateString("ru-RU") });
    saveReviews(eventId, reviews);

    if (authorInput) authorInput.value = "";
    if (textInput) textInput.value = "";
    renderReviews(eventId);
  }

  window.tp = {
    getEvents,
    renderEventCards,
    applyFilters,
    loadEvent,
    buyTicket,
    loadUserDashboard,
    loadOrganizerDashboard,
    createEventFromForm,
    returnTicket,
    hideOrganizerLinks,
    requireOrganizer,
    hideUserLinks,
    toggleCreateForm,
    submitReview
  };
})();