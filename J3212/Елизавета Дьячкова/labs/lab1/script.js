(function () {
  const STORAGE_CURRENT_USER = 'tickethub_current_user';
  const STORAGE_TICKETS = 'tickethub_tickets';
  const STORAGE_EVENTS = 'tickethub_events';

  const readStorage = function (key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const writeStorage = function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const showToast = function (message) {
    const toastEl = document.getElementById('actionToast');
    const body = document.getElementById('toastBody');
    if (!toastEl || !body || !window.bootstrap) return;
    body.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  };

  const defaultEvents = [
    {
      id: 1,
      title: 'Концерт симфонической музыки',
      type: 'concert',
      city: 'spb',
      cityName: 'Санкт‑Петербург',
      date: '2026-04-10',
      venue: 'Большой зал филармонии',
      priceFrom: 1200,
      description: 'Вечер классической музыки с участием симфонического оркестра.',
      reviews: ['Потрясающая атмосфера!', 'Очень понравился звук и программа.']
    },
    {
      id: 2,
      title: 'Театральная постановка "Город огней"',
      type: 'theatre',
      city: 'msk',
      cityName: 'Москва',
      date: '2026-04-18',
      venue: 'Театр на Новой сцене',
      priceFrom: 900,
      description: 'Современная постановка о жизни большого города.',
      reviews: ['Интересная режиссёрская работа.', 'Актёры на высоте.']
    },
    {
      id: 3,
      title: 'Летний музыкальный фестиваль',
      type: 'festival',
      city: 'spb',
      cityName: 'Санкт‑Петербург',
      date: '2026-06-25',
      venue: 'Парк 300‑летия',
      priceFrom: 1500,
      description: 'Открытый фестиваль с несколькими сценами и фудкортом.',
      reviews: ['Отличный выбор артистов.', 'Удобная организация и локация.']
    }
  ];

  const resolveEvents = function () {
    const stored = readStorage(STORAGE_EVENTS);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      writeStorage(STORAGE_EVENTS, defaultEvents);
      return defaultEvents.slice();
    }
    return stored;
  };

  const cityLabel = function (city) {
    if (city === 'spb') return 'Санкт‑Петербург';
    if (city === 'msk') return 'Москва';
    if (city === 'nsk') return 'Новосибирск';
    if (city === 'ptz') return 'Петрозаводск';
    return city || '';
  };

  const getEventById = function (id) {
    const events = resolveEvents();
    const numId = Number(id);
    return events.find(function (e) { return e.id === numId; });
  };

  // ----- index.html: поиск и список мероприятий -----
  const eventsListEl = document.getElementById('eventsList');
  const searchForm = document.getElementById('searchForm');

  const renderEventsList = function (items) {
    if (!eventsListEl) return;
    if (!items.length) {
      eventsListEl.innerHTML = '<p class="text-secondary">Мероприятий по выбранным фильтрам не найдено.</p>';
      return;
    }
    eventsListEl.innerHTML = items
      .map(function (event) {
        return (
          '<div class="col-12 col-md-6">' +
          '<article class="card card-event h-100">' +
          '<div class="card-body d-flex flex-column">' +
          '<h2 class="h6 card-title mb-1">' + event.title + '</h2>' +
          '<p class="small text-secondary mb-1">' + cityLabel(event.city) + ' · ' + event.date + '</p>' +
          '<p class="small text-secondary mb-2">' + event.venue + '</p>' +
          '<p class="mb-2 small flex-grow-1">' + event.description + '</p>' +
          '<div class="d-flex justify-content-between align-items-center mt-2">' +
          '<span class="fw-semibold">' + event.priceFrom + ' ₽</span>' +
          '<a class="btn btn-sm btn-outline-primary" href="event.html?id=' + event.id + '">Подробнее</a>' +
          '</div></div></article></div>'
        );
      })
      .join('');
  };

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var events = resolveEvents();
      var queryEl = document.getElementById('searchQuery');
      var typeEl = document.getElementById('filterType');
      var dateEl = document.getElementById('filterDate');
      var cityEl = document.getElementById('filterCity');
      var query = (queryEl && queryEl.value) ? queryEl.value.trim().toLowerCase() : '';
      var type = (typeEl && typeEl.value) ? typeEl.value : '';
      var dateFilter = (dateEl && dateEl.value) ? dateEl.value.trim() : '';
      var city = (cityEl && cityEl.value) ? cityEl.value : '';

      var filtered = events.filter(function (event) {
        var matchesQuery = !query ||
          (event.title && event.title.toLowerCase().indexOf(query) !== -1) ||
          (event.description && event.description.toLowerCase().indexOf(query) !== -1);
        var matchesType = !type || event.type === type;
        var matchesDate = !dateFilter || event.date === dateFilter;
        var matchesCity = !city || event.city === city;
        return matchesQuery && matchesType && matchesDate && matchesCity;
      });
      renderEventsList(filtered);
    });
  }

  var clearDateButton = document.getElementById('clearDateButton');
  var filterDateInput = document.getElementById('filterDate');
  if (clearDateButton && filterDateInput) {
    clearDateButton.addEventListener('click', function () {
      filterDateInput.value = '';
      if (eventsListEl) renderEventsList(resolveEvents());
    });
  }

  if (eventsListEl) {
    renderEventsList(resolveEvents());
  }

  // ----- login.html -----
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('loginEmail') && document.getElementById('loginEmail').value.trim();
      var password = document.getElementById('loginPassword') && document.getElementById('loginPassword').value.trim();
      if (!email || !password) return;
      writeStorage(STORAGE_CURRENT_USER, { name: 'Пользователь', email: email });
      showToast('Вы вошли в систему');
      window.location.href = 'profile.html';
    });
  }

  // ----- register.html -----
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('registerName') && document.getElementById('registerName').value.trim();
      var email = document.getElementById('registerEmail') && document.getElementById('registerEmail').value.trim();
      var password = document.getElementById('registerPassword') && document.getElementById('registerPassword').value.trim();
      if (!name || !email || !password) return;
      writeStorage(STORAGE_CURRENT_USER, { name: name, email: email });
      showToast('Аккаунт создан, вы вошли в систему');
      window.location.href = 'profile.html';
    });
  }

  // ----- profile.html -----
  var profileEmail = document.getElementById('profileEmail');
  var ticketsList = document.getElementById('ticketsList');
  var noTicketsText = document.getElementById('noTicketsText');
  var logoutButton = document.getElementById('logoutButton');

  const updateTicketsUI = function () {
    if (!ticketsList || !noTicketsText) return;
    var items = readStorage(STORAGE_TICKETS) || [];
    if (!items.length) {
      ticketsList.innerHTML = '';
      noTicketsText.classList.remove('d-none');
      return;
    }
    noTicketsText.classList.add('d-none');
    ticketsList.innerHTML = items
      .map(function (ticket) {
        return (
          '<div class="col-12 col-md-6">' +
          '<article class="card h-100"><div class="card-body">' +
          '<h2 class="h6 mb-1">' + ticket.eventTitle + '</h2>' +
          '<p class="small text-secondary mb-1">' + ticket.city + ' · ' + ticket.date + '</p>' +
          '<p class="small mb-0">Цена: ' + ticket.price + ' ₽</p>' +
          '</div></article></div>'
        );
      })
      .join('');
  };

  if (profileEmail) {
    var currentUser = readStorage(STORAGE_CURRENT_USER);
    profileEmail.textContent = currentUser && currentUser.email ? currentUser.email : '';
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();
      writeStorage(STORAGE_CURRENT_USER, null);
      showToast('Вы вышли из аккаунта');
      window.location.href = 'index.html';
    });
  }

  if (ticketsList) updateTicketsUI();

  // ----- event.html -----
  var eventTitleEl = document.getElementById('eventTitle');
  var eventMetaEl = document.getElementById('eventMeta');
  var eventDescriptionEl = document.getElementById('eventDescription');
  var eventVenueEl = document.getElementById('eventVenue');
  var eventReviewsEl = document.getElementById('eventReviews');
  var buyTicketButton = document.getElementById('buyTicketButton');
  var eventPageEl = document.getElementById('eventPage');
  var eventNotFoundEl = document.getElementById('eventNotFound');

  if (eventTitleEl && eventPageEl && eventNotFoundEl) {
    var params = new URLSearchParams(window.location.search);
    var eventId = params.get('id');
    var event = eventId ? getEventById(eventId) : null;

    if (!event) {
      eventPageEl.classList.add('d-none');
      eventNotFoundEl.classList.remove('d-none');
    } else {
      eventTitleEl.textContent = event.title;
      if (eventMetaEl) eventMetaEl.textContent = cityLabel(event.city) + ' · ' + event.date;
      if (eventDescriptionEl) eventDescriptionEl.textContent = event.description || '';
      if (eventVenueEl) eventVenueEl.textContent = event.venue || '';
      if (eventReviewsEl) {
        var reviews = event.reviews && event.reviews.length ? event.reviews : ['Пока нет отзывов.'];
        eventReviewsEl.innerHTML = reviews.map(function (text) {
          return '<li class="list-group-item">' + text + '</li>';
        }).join('');
      }

      if (buyTicketButton) {
        buyTicketButton.addEventListener('click', function () {
          var user = readStorage(STORAGE_CURRENT_USER);
          if (!user) {
            showToast('Сначала войдите в аккаунт');
            window.location.href = 'login.html?from=' + encodeURIComponent(window.location.pathname + '?id=' + eventId);
            return;
          }
          var existing = readStorage(STORAGE_TICKETS) || [];
          existing.push({
            id: Date.now(),
            eventTitle: event.title,
            date: event.date,
            city: cityLabel(event.city),
            price: event.priceFrom
          });
          writeStorage(STORAGE_TICKETS, existing);
          showToast('Билет добавлен. Смотрите в личном кабинете.');
        });
      }
    }
  }

  // ----- organizer.html -----
  var createEventForm = document.getElementById('createEventForm');
  var organizerEvents = document.getElementById('organizerEvents');
  var noOrganizerEventsText = document.getElementById('noOrganizerEventsText');

  const updateOrganizerEvents = function () {
    if (!organizerEvents || !noOrganizerEventsText) return;
    var events = resolveEvents();
    var own = events.filter(function (e) { return e.isCustom; });
    if (!own.length) {
      organizerEvents.innerHTML = '';
      noOrganizerEventsText.classList.remove('d-none');
      return;
    }
    noOrganizerEventsText.classList.add('d-none');
    organizerEvents.innerHTML = own
      .map(function (event) {
        return (
          '<div class="col-12">' +
          '<article class="card h-100">' +
          '<div class="card-body d-flex justify-content-between align-items-center">' +
          '<div><h2 class="h6 mb-1">' + event.title + '</h2>' +
          '<p class="small text-secondary mb-0">' + cityLabel(event.city) + ' · ' + event.date + '</p></div>' +
          '<span class="fw-semibold">' + event.priceFrom + ' ₽</span>' +
          '</div></article></div>'
        );
      })
      .join('');
  };

  if (createEventForm) {
    createEventForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('eventTitle').value.trim();
      var citySelect = document.getElementById('eventCity');
      var city = citySelect && citySelect.value ? citySelect.value : '';
      var date = document.getElementById('eventDate').value;
      var type = document.getElementById('eventType').value;
      var price = Number(document.getElementById('eventPrice').value);
      if (!title || !city || !date || !type || !price) return;

      var newEvent = {
        id: Date.now(),
        title: title,
        type: type,
        city: city,
        cityName: cityLabel(city),
        date: date,
        venue: 'Площадка будет уточнена',
        priceFrom: price,
        description: 'Событие, добавленное организатором.',
        reviews: [],
        isCustom: true
      };

      var events = resolveEvents();
      events.push(newEvent);
      writeStorage(STORAGE_EVENTS, events);
      updateOrganizerEvents();
      showToast('Событие создано');
      createEventForm.reset();
    });
  }

  if (organizerEvents) updateOrganizerEvents();
})();
