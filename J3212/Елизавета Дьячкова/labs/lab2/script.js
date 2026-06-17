(function () {
  var API_BASE = window.TICKETHUB_API_URL || 'http://127.0.0.1:3001';
  var STORAGE_CURRENT_USER = 'tickethub_current_user';
  var STORAGE_AUTH_TOKEN = 'tickethub_auth_token';
  var STORAGE_EVENTS_SESSION = 'tickethub_events_cache';
  var STORAGE_PENDING_EVENT_ID = 'tickethub_pending_event_id';

  var readStorage = function (key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  var writeStorage = function (key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  var showToast = function (message) {
    var toastEl = document.getElementById('actionToast');
    var body = document.getElementById('toastBody');
    if (!toastEl || !body || !window.bootstrap) return;
    body.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  };

  var setApiStatus = function (text, isError) {
    var el = document.getElementById('apiStatus');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('d-none', !text);
    el.classList.remove('alert-danger', 'alert-info');
    if (text) {
      el.classList.add(isError ? 'alert-danger' : 'alert-info');
    }
    el.setAttribute('role', isError ? 'alert' : 'status');
  };

  var getAuthToken = function () {
    var t = readStorage(STORAGE_AUTH_TOKEN);
    return t && typeof t === 'string' ? t : null;
  };

  var parseJwtPayload = function (token) {
    try {
      var part = token.split('.')[1];
      if (!part) return null;
      var base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  var fetchJson = function (path, options) {
    var opts = options || {};
    var headers = Object.assign(
      { Accept: 'application/json', 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      opts.headers || {}
    );
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    var token = getAuthToken();
    if (token && !opts.skipAuth) {
      headers.Authorization = 'Bearer ' + token;
    }
    var init = Object.assign({ cache: 'no-store' }, opts, { headers: headers });
    delete init.skipAuth;
    if (init.body && typeof init.body === 'object' && !(init.body instanceof FormData)) {
      init.body = JSON.stringify(init.body);
    }
    return fetch(API_BASE + path, init).then(function (res) {
      if (res.status === 204) return null;
      return res.text().then(function (text) {
        var data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = null;
          }
        }
        if (!res.ok) {
          var errMsg =
            (data && (data.message || data.error)) ||
            (typeof text === 'string' && text.length && !/<!doctype|<\s*html[\s>]/i.test(text)
              ? text.slice(0, 200)
              : '') ||
            res.statusText;
          throw new Error(typeof errMsg === 'string' ? errMsg : res.statusText);
        }
        if (res.status === 304 && data == null) {
          throw new Error('not modified');
        }
        if (data == null && text && String(text).trim()) {
          if (/<!doctype|<\s*html[\s>]/i.test(text)) {
            throw new Error(
              ''
            );
          }
          throw new Error(
            'Ответ сервера не распознан как JSON. Убедитесь, что API запущен на http://127.0.0.1:3001.'
          );
        }
        return data;
      });
    });
  };

  var saveSessionFromAccessToken = function (accessToken) {
    if (!accessToken) return Promise.reject(new Error('Нет токена доступа'));
    writeStorage(STORAGE_AUTH_TOKEN, accessToken);
    var payload = parseJwtPayload(accessToken);
    var uid = payload && (payload.sub != null ? payload.sub : null);
    if (uid == null) return Promise.reject(new Error('Недействительный токен'));
    return fetchJson('/users/' + encodeURIComponent(uid)).then(function (user) {
      writeStorage(STORAGE_CURRENT_USER, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      });
    });
  };

  var escapeAttr = function (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  var cityLabel = function (city) {
    if (city === 'spb') return 'Санкт‑Петербург';
    if (city === 'msk') return 'Москва';
    if (city === 'nsk') return 'Новосибирск';
    if (city === 'ptz') return 'Петрозаводск';
    return city || '';
  };

  var normalizeEventsList = function (data) {
    if (data == null) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && Array.isArray(data.events)) return data.events;
    if (typeof data === 'object') {
      var vals = Object.values(data);
      if (
        vals.length &&
        vals.every(function (x) {
          return x != null && typeof x === 'object' && 'id' in x;
        })
      ) {
        return vals;
      }
    }
    return [];
  };

  var persistEventsSession = function (list) {
    try {
      sessionStorage.setItem(STORAGE_EVENTS_SESSION, JSON.stringify(list));
    } catch (err) {}
  };

  var readEventsFromSession = function () {
    try {
      var raw = sessionStorage.getItem(STORAGE_EVENTS_SESSION);
      if (!raw) return [];
      return normalizeEventsList(JSON.parse(raw));
    } catch (e) {
      return [];
    }
  };

  var cachedEvents = [];

  var loadEventsFromApi = function () {
    return fetchJson('/events', { skipAuth: true }).then(function (list) {
      cachedEvents = normalizeEventsList(list);
      if (cachedEvents.length) persistEventsSession(cachedEvents);
      setApiStatus('', false);
      return cachedEvents;
    });
  };

  var findEventInList = function (list, idStr) {
    if (!Array.isArray(list)) return null;
    var sid = String(idStr).trim();
    var num = Number(sid);
    var useNum = !isNaN(num) && sid !== '';
    return (
      list.find(function (e) {
        if (e == null || e.id == null) return false;
        if (String(e.id).trim() === sid) return true;
        if (useNum && Number(e.id) === num) return true;
        return false;
      }) || null
    );
  };

  var loadEventsListForFallback = function (rawId) {
    return fetchJson('/events', { skipAuth: true }).then(function (list) {
      var normalized = normalizeEventsList(list);
      if (normalized.length) persistEventsSession(normalized);
      var found = findEventInList(normalized, rawId);
      if (found) return found;
      found = findEventInList(readEventsFromSession(), rawId);
      if (found) return found;
      return Promise.reject(new Error('not found'));
    });
  };

  var getEventByIdFromApi = function (id) {
    var rawId = String(id).trim();
    return fetchJson('/events/' + encodeURIComponent(rawId), { skipAuth: true })
      .then(function (item) {
        if (item == null) return loadEventsListForFallback(rawId);
        if (Array.isArray(item)) {
          var one = findEventInList(item, rawId);
          return one ? one : loadEventsListForFallback(rawId);
        }
        if (typeof item === 'object' && item.id != null) return item;
        return loadEventsListForFallback(rawId);
      })
      .catch(function () {
        return loadEventsListForFallback(rawId);
      })
      .catch(function () {
        var found = findEventInList(readEventsFromSession(), rawId);
        if (found) return found;
        return Promise.reject(new Error('not found'));
      });
  };

  var eventsListEl = document.getElementById('eventsList');
  var searchForm = document.getElementById('searchForm');

  var renderEventsList = function (items) {
    if (!eventsListEl) return;
    if (!items.length) {
      eventsListEl.innerHTML =
        '<p class="text-secondary" role="status">Подходящих мероприятий нет. Измените условия поиска.</p>';
      return;
    }
    eventsListEl.innerHTML = items
      .map(function (event) {
        return (
          '<div class="col-12 col-md-6">' +
          '<article class="card card-event h-100">' +
          '<div class="card-body d-flex flex-column">' +
          '<h2 class="h6 card-title mb-1">' +
          String(event.title).replace(/</g, '&lt;').replace(/>/g, '&gt;') +
          '</h2>' +
          '<p class="small text-secondary mb-1">' +
          cityLabel(event.city) +
          ' · ' +
          event.date +
          '</p>' +
          '<p class="small text-secondary mb-2">' +
          String(event.venue || '')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;') +
          '</p>' +
          '<p class="mb-2 small flex-grow-1">' +
          String(event.description || '')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;') +
          '</p>' +
          '<div class="d-flex justify-content-between align-items-center mt-2">' +
          '<span class="fw-semibold">' +
          event.priceFrom +
          ' ₽</span>' +
          '<a class="btn btn-sm btn-outline-primary" href="' +
          (function () {
            var eid = event != null && event.id != null ? String(event.id) : '';
            if (!eid) return '#';
            var q = 'event.html?id=' + encodeURIComponent(eid);
            return q.replace(/"/g, '&quot;');
          })() +
          '" aria-label="' +
          escapeAttr('Подробнее о мероприятии: ' + (event.title || '')) +
          '">Подробнее</a>' +
          '</div></div></article></div>'
        );
      })
      .join('');
  };

  var applyFilters = function (events) {
    var queryEl = document.getElementById('searchQuery');
    var typeEl = document.getElementById('filterType');
    var dateEl = document.getElementById('filterDate');
    var cityEl = document.getElementById('filterCity');
    var query = queryEl && queryEl.value ? queryEl.value.trim().toLowerCase() : '';
    var type = typeEl && typeEl.value ? typeEl.value : '';
    var dateFilter = dateEl && dateEl.value ? dateEl.value.trim() : '';
    var city = cityEl && cityEl.value ? cityEl.value : '';
    return events.filter(function (event) {
      var matchesQuery =
        !query ||
        (event.title && event.title.toLowerCase().indexOf(query) !== -1) ||
        (event.description && event.description.toLowerCase().indexOf(query) !== -1);
      var matchesType = !type || event.type === type;
      var matchesDate = !dateFilter || event.date === dateFilter;
      var matchesCity = !city || event.city === city;
      return matchesQuery && matchesType && matchesDate && matchesCity;
    });
  };

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      renderEventsList(applyFilters(cachedEvents));
    });
  }

  var clearDateButton = document.getElementById('clearDateButton');
  var filterDateInput = document.getElementById('filterDate');
  if (clearDateButton && filterDateInput) {
    clearDateButton.addEventListener('click', function () {
      filterDateInput.value = '';
      if (eventsListEl) renderEventsList(cachedEvents);
    });
  }

  if (eventsListEl) {
    eventsListEl.setAttribute('aria-busy', 'true');
    loadEventsFromApi()
      .then(function () {
        renderEventsList(cachedEvents);
      })
      .catch(function () {
        setApiStatus(
          'Не удаётся связаться с сервером данных. В папке lab2 выполните npm run api и обновите страницу.',
          true
        );
        eventsListEl.innerHTML =
          '<p class="text-danger" role="alert">Список мероприятий не загрузился. Запущен ли API на порту 3001?</p>';
      })
      .finally(function () {
        eventsListEl.removeAttribute('aria-busy');
      });
  }

  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('loginEmail') && document.getElementById('loginEmail').value.trim();
      var password = document.getElementById('loginPassword') && document.getElementById('loginPassword').value.trim();
      if (!email || !password) return;
      fetchJson('/login', {
        method: 'POST',
        skipAuth: true,
        body: { email: email, password: password }
      })
        .then(function (data) {
          if (!data || !data.accessToken) {
            showToast('Сервер вернул неожиданный ответ. Попробуйте ещё раз.');
            return Promise.reject(new Error('no token'));
          }
          return saveSessionFromAccessToken(data.accessToken);
        })
        .then(function () {
          showToast('Вы вошли');
          var from = new URLSearchParams(window.location.search).get('from');
          window.location.href = from ? decodeURIComponent(from) : 'profile.html';
        })
        .catch(function (err) {
          var m = (err && err.message) || '';
          if (m === 'no token') return;
          var badCreds =
            m.indexOf('Unauthorized') !== -1 ||
            m.indexOf('Cannot') !== -1 ||
            m.indexOf('password') !== -1 ||
            m.indexOf('credentials') !== -1;
          showToast(
            badCreds ? 'Неверный адрес почты или пароль' : m || 'Не удалось войти. Запустите сервер: npm run api.'
          );
        });
    });
  }

  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('registerName') && document.getElementById('registerName').value.trim();
      var email = document.getElementById('registerEmail') && document.getElementById('registerEmail').value.trim();
      var password = document.getElementById('registerPassword') && document.getElementById('registerPassword').value.trim();
      if (!name || !email || !password) return;
      fetchJson('/register', {
        method: 'POST',
        skipAuth: true,
        body: { email: email, password: password, name: name, role: 'user' }
      })
        .then(function (data) {
          if (!data || !data.accessToken) {
            showToast('Не удалось завершить регистрацию. Повторите попытку или проверьте, запущен ли npm run api.');
            return Promise.reject(new Error('no token'));
          }
          return saveSessionFromAccessToken(data.accessToken);
        })
        .then(function () {
          showToast('Регистрация завершена, вы вошли');
          window.location.href = 'profile.html';
        })
        .catch(function (err) {
          var m = (err && err.message) || '';
          if (m === 'no token') return;
          showToast(
            m.indexOf('already') !== -1 || m.indexOf('Email') !== -1
              ? 'Этот e-mail уже зарегистрирован'
              : m || 'Не удалось зарегистрироваться. Запустите сервер: npm run api.'
          );
        });
    });
  }

  var profileEmail = document.getElementById('profileEmail');
  var ticketsList = document.getElementById('ticketsList');
  var noTicketsText = document.getElementById('noTicketsText');
  var logoutButton = document.getElementById('logoutButton');
  var profileRedirected = false;
  if (profileEmail && ticketsList) {
    var profileUser = readStorage(STORAGE_CURRENT_USER);
    if (!getAuthToken() || !profileUser || profileUser.id == null) {
      window.location.replace('login.html?from=' + encodeURIComponent('profile.html'));
      profileRedirected = true;
    }
  }

  var updateTicketsUIFromApi = function () {
    if (!ticketsList || !noTicketsText) return;
    var user = readStorage(STORAGE_CURRENT_USER);
    if (!user || !user.id) {
      ticketsList.innerHTML = '';
      noTicketsText.textContent = 'Войдите, чтобы видеть билеты.';
      noTicketsText.classList.remove('d-none');
      return;
    }
    ticketsList.setAttribute('aria-busy', 'true');
    fetchJson('/tickets?userId=' + encodeURIComponent(user.id))
      .then(function (items) {
        if (!items || !items.length) {
          ticketsList.innerHTML = '';
          noTicketsText.textContent = 'Вы ещё не покупали билеты.';
          noTicketsText.classList.remove('d-none');
          return;
        }
        noTicketsText.classList.add('d-none');
        ticketsList.innerHTML = items
          .map(function (ticket) {
            return (
              '<div class="col-12 col-md-6">' +
              '<article class="card h-100"><div class="card-body">' +
              '<h2 class="h6 mb-1">' +
              String(ticket.eventTitle || '')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;') +
              '</h2>' +
              '<p class="small text-secondary mb-1">' +
              ticket.city +
              ' · ' +
              ticket.date +
              '</p>' +
              '<p class="small mb-0">Цена: ' +
              ticket.price +
              ' ₽</p>' +
              '</div></article></div>'
            );
          })
          .join('');
      })
      .catch(function () {
        showToast('Не удалось загрузить билеты');
        ticketsList.innerHTML = '';
        noTicketsText.textContent = 'Не удалось загрузить список билетов.';
        noTicketsText.classList.remove('d-none');
      })
      .finally(function () {
        ticketsList.removeAttribute('aria-busy');
      });
  };

  if (!profileRedirected && profileEmail) {
    var currentUser = readStorage(STORAGE_CURRENT_USER);
    profileEmail.textContent = currentUser && currentUser.email ? currentUser.email : '';
  }

  if (!profileRedirected && logoutButton) {
    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();
      writeStorage(STORAGE_CURRENT_USER, null);
      writeStorage(STORAGE_AUTH_TOKEN, null);
      showToast('Вы вышли из аккаунта');
      window.location.href = 'index.html';
    });
  }

  if (!profileRedirected && ticketsList) updateTicketsUIFromApi();

  var eventTitleEl =
    document.getElementById('eventDetailHeading') || document.getElementById('eventTitle');
  var eventMetaEl = document.getElementById('eventMeta');
  var eventDescriptionEl = document.getElementById('eventDescription');
  var eventVenueEl = document.getElementById('eventVenue');
  var eventReviewsEl = document.getElementById('eventReviews');
  var buyTicketButton = document.getElementById('buyTicketButton');
  var eventPageEl = document.getElementById('eventPage');
  var eventNotFoundEl = document.getElementById('eventNotFound');

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="event.html"]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var m = href.match(/[?&]id=([^&]+)/);
      if (m) {
        try {
          sessionStorage.setItem(STORAGE_PENDING_EVENT_ID, decodeURIComponent(m[1]));
        } catch (err) {}
      }
    },
    true
  );

  if (eventTitleEl && eventPageEl && eventNotFoundEl) {
    var params = new URLSearchParams(window.location.search);
    var eventId = params.get('id');
    if (eventId) {
      try {
        eventId = decodeURIComponent(eventId);
      } catch (e) {}
    }
    if (!eventId || !String(eventId).trim()) {
      try {
        eventId = sessionStorage.getItem(STORAGE_PENDING_EVENT_ID);
        if (eventId) sessionStorage.removeItem(STORAGE_PENDING_EVENT_ID);
      } catch (e2) {}
    }
    if (!eventId || !String(eventId).trim()) {
      var hashRaw = (window.location.hash || '').replace(/^#/, '');
      if (hashRaw.indexOf('id=') === 0) {
        try {
          eventId = decodeURIComponent(hashRaw.slice(3));
        } catch (e3) {}
      } else if (/^\d+$/.test(hashRaw)) {
        eventId = hashRaw;
      }
    }
    if (!eventId || !String(eventId).trim()) {
      eventPageEl.classList.add('d-none');
      eventNotFoundEl.classList.remove('d-none');
      eventNotFoundEl.textContent =
        'Не выбрано мероприятие. Откройте главную и нажмите «Подробнее» в карточке.';
    } else {
      try {
        if (params.get('id')) sessionStorage.removeItem(STORAGE_PENDING_EVENT_ID);
      } catch (e4) {}
      eventPageEl.setAttribute('aria-busy', 'true');
      getEventByIdFromApi(eventId)
        .then(function (event) {
          if (!event || event.id == null) throw new Error('not found');
          eventTitleEl.textContent = event.title;
          if (eventMetaEl) eventMetaEl.textContent = cityLabel(event.city) + ' · ' + event.date;
          if (eventDescriptionEl) eventDescriptionEl.textContent = event.description || '';
          if (eventVenueEl) eventVenueEl.textContent = event.venue || '';
          if (eventReviewsEl) {
            var reviews = event.reviews && event.reviews.length ? event.reviews : ['Пока нет отзывов.'];
            eventReviewsEl.innerHTML = reviews
              .map(function (text) {
                return '<li class="list-group-item">' + String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</li>';
              })
              .join('');
          }
          if (buyTicketButton) {
            buyTicketButton.setAttribute(
              'aria-label',
              'Купить билет на мероприятие: ' + (event.title || '')
            );
            buyTicketButton.onclick = function () {
              var user = readStorage(STORAGE_CURRENT_USER);
              var token = getAuthToken();
              if (!user || !user.id || !token) {
                showToast('Сначала войдите в аккаунт');
                window.location.href =
                  'login.html?from=' + encodeURIComponent(window.location.pathname + window.location.search);
                return;
              }
              fetchJson('/tickets', {
                method: 'POST',
                body: {
                  userId: user.id,
                  eventId: event.id,
                  eventTitle: event.title,
                  date: event.date,
                  city: cityLabel(event.city),
                  price: event.priceFrom
                }
              })
                .then(function () {
                  showToast('Билет сохранён. Его можно посмотреть в личном кабинете.');
                })
                .catch(function () {
                  showToast('Не удалось оформить билет');
                });
            };
          }
        })
        .catch(function (err) {
          eventPageEl.classList.add('d-none');
          eventNotFoundEl.classList.remove('d-none');
          var m = err && err.message ? String(err.message) : '';
          var baseMsg =
            'Мероприятие не найдено. Откройте главную, дождитесь списка и снова нажмите «Подробнее». Убедитесь, что в папке lab2 запущен npm run api.';
          if (m.indexOf('HTML') !== -1 || m.indexOf('JSON') !== -1 || m.indexOf('Failed to fetch') !== -1) {
            eventNotFoundEl.textContent =
              m ||
              'Нет ответа от сервера данных. В папке lab2 выполните npm run api и откройте сайт по http://127.0.0.1, не как файл с диска.';
          } else {
            eventNotFoundEl.textContent =
              m && m !== 'not found' ? 'Не удалось открыть мероприятие: ' + m : baseMsg;
          }
        })
        .finally(function () {
          eventPageEl.removeAttribute('aria-busy');
        });
    }
  }

  var createEventForm = document.getElementById('createEventForm');
  var organizerEvents = document.getElementById('organizerEvents');
  var noOrganizerEventsText = document.getElementById('noOrganizerEventsText');

  var updateOrganizerEventsFromApi = function () {
    if (!organizerEvents || !noOrganizerEventsText) return;
    var user = readStorage(STORAGE_CURRENT_USER);
    if (!user || !user.id) {
      organizerEvents.innerHTML = '';
      noOrganizerEventsText.textContent = 'Войдите, чтобы управлять событиями.';
      noOrganizerEventsText.classList.remove('d-none');
      return;
    }
    organizerEvents.setAttribute('aria-busy', 'true');
    loadEventsFromApi()
      .then(function () {
        var own = cachedEvents.filter(function (e) {
          return Number(e.organizerUserId) === Number(user.id);
        });
        if (!own.length) {
          organizerEvents.innerHTML = '';
          noOrganizerEventsText.textContent = 'Событий пока нет. Создайте первое ниже.';
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
              '<div><h2 class="h6 mb-1">' +
              String(event.title)
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;') +
              '</h2>' +
              '<p class="small text-secondary mb-0">' +
              cityLabel(event.city) +
              ' · ' +
              event.date +
              '</p></div>' +
              '<span class="fw-semibold">' +
              event.priceFrom +
              ' ₽</span>' +
              '</div></article></div>'
            );
          })
          .join('');
      })
      .catch(function () {
        showToast('Не удалось загрузить список ваших событий');
      })
      .finally(function () {
        organizerEvents.removeAttribute('aria-busy');
      });
  };

  if (createEventForm) {
    createEventForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var user = readStorage(STORAGE_CURRENT_USER);
      var token = getAuthToken();
      if (!user || !user.id || !token) {
        showToast('Войдите в аккаунт, чтобы создавать события');
        window.location.href = 'login.html';
        return;
      }
      var title = document.getElementById('eventTitle').value.trim();
      var citySelect = document.getElementById('eventCity');
      var city = citySelect && citySelect.value ? citySelect.value : '';
      var date = document.getElementById('eventDate').value;
      var type = document.getElementById('eventType').value;
      var price = Number(document.getElementById('eventPrice').value);
      if (!title || !city || !date || !type || !price) return;

      var body = {
        title: title,
        type: type,
        city: city,
        cityName: cityLabel(city),
        date: date,
        venue: 'Площадка будет уточнена',
        priceFrom: price,
        description: 'Событие, добавленное организатором.',
        reviews: [],
        organizerUserId: user.id
      };

      fetchJson('/events', { method: 'POST', body: body })
        .then(function () {
          showToast('Событие создано');
          createEventForm.reset();
          return updateOrganizerEventsFromApi();
        })
        .catch(function () {
          showToast('Не удалось создать событие');
        });
    });
  }

  if (organizerEvents) updateOrganizerEventsFromApi();

  var updateNavAuth = function () {
    var cu = readStorage(STORAGE_CURRENT_USER);
    var loggedIn = !!(getAuthToken() && cu && cu.id != null);
    document.querySelectorAll('[data-auth="guest"]').forEach(function (el) {
      el.classList.toggle('d-none', loggedIn);
    });
    document.querySelectorAll('[data-auth="user"]').forEach(function (el) {
      el.classList.toggle('d-none', !loggedIn);
    });
  };

  var applyLocalHtmlLinks = function () {
    var names = ['index.html', 'login.html', 'register.html', 'profile.html', 'organizer.html'];
    var base;
    try {
      base = window.location.href;
    } catch (e) {
      return;
    }
    names.forEach(function (name) {
      var resolved;
      try {
        resolved = new URL(name, base).href;
      } catch (e2) {
        return;
      }
      document.querySelectorAll('a').forEach(function (a) {
        if (a.getAttribute('href') === name) a.setAttribute('href', resolved);
      });
    });
  };

  applyLocalHtmlLinks();
  updateNavAuth();
})();
