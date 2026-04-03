const API_BASE_URL = "http://localhost:3000";
const SESSION_STORAGE_KEY = "makars-event-lab2-session";
const THEME_STORAGE_KEY = "makars-event-lab2-theme";
const DARK_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const KNOWN_PAGES = [
  "index.html",
  "events.html",
  "event.html",
  "login.html",
  "register.html",
  "user-cabinet.html",
  "organizer-cabinet.html"
];

applyTheme(resolvePreferredTheme());

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setCurrentYear();
  renderNavigationAuth();
  initLogoutButtons();
  initAuthForms();
  void initEventsPage();
  void initEventPage();
  void initUserCabinetPage();
  void initOrganizerCabinetPage();
  void initHomePage();
});

function initTheme() {
  renderThemeToggle();
  syncThemeToggleState();

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".js-theme-toggle");
    if (!button) return;

    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    saveThemePreference(nextTheme);
    applyTheme(nextTheme);
    syncThemeToggleState();
  });

  const mediaQuery = window.matchMedia(DARK_COLOR_SCHEME_QUERY);
  const handleSystemThemeChange = (event) => {
    if (getStoredThemePreference()) return;

    applyTheme(event.matches ? "dark" : "light");
    syncThemeToggleState();
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleSystemThemeChange);
  }
}

function renderThemeToggle() {
  document.querySelectorAll(".nav-actions").forEach((container) => {
    let button = container.querySelector(".js-theme-toggle");

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "theme-toggle js-theme-toggle";
      container.prepend(button);
    }
  });
}

function syncThemeToggleState() {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const themeLabel = currentTheme === "dark" ? "тёмная" : "светлая";
  const nextThemeLabel = currentTheme === "dark" ? "светлую" : "тёмную";

  document.querySelectorAll(".js-theme-toggle").forEach((button) => {
    button.textContent = `Тема: ${themeLabel}`;
    button.setAttribute("aria-pressed", String(currentTheme === "dark"));
    button.setAttribute("aria-label", `Текущая тема: ${themeLabel}. Нажмите, чтобы переключить на ${nextThemeLabel}.`);
    button.title = `Переключить на ${nextThemeLabel} тему`;
  });
}

function getStoredThemePreference() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "";
  } catch (error) {
    return "";
  }
}

function getSystemThemePreference() {
  return window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

function resolvePreferredTheme() {
  return getStoredThemePreference() || getSystemThemePreference();
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage errors and keep the theme only for the current session.
  }
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  document.documentElement.setAttribute("data-bs-theme", safeTheme);
}

function setCurrentYear() {
  document.querySelectorAll(".js-current-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function getSession() {
  try {
    const rawValue = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function renderNavigationAuth() {
  const session = getSession();
  const containers = document.querySelectorAll(".js-nav-auth");
  if (!containers.length) return;

  containers.forEach((container) => {
    if (!session?.user) {
      container.innerHTML = `
        <a class="btn btn-outline-light btn-sm" href="login.html">Вход</a>
        <a class="btn btn-warning btn-sm" href="register.html">Регистрация</a>
      `;
      return;
    }

    const cabinetHref = getCabinetPageByRole(session.user.role);
    const firstName = escapeHtml(session.user.firstName || "Профиль");
    const roleLabel = session.user.role === "organizer" ? "Организатор" : "Покупатель";

    container.innerHTML = `
      <span class="nav-user-chip" aria-label="Текущий пользователь">${firstName} · ${roleLabel}</span>
      <a class="btn btn-outline-light btn-sm" href="${cabinetHref}">Кабинет</a>
      <button type="button" class="btn btn-warning btn-sm js-logout-btn">Выйти</button>
    `;
  });
}

function initLogoutButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".js-logout-btn");
    if (!button) return;

    clearSession();
    renderNavigationAuth();
    window.location.href = "index.html";
  });
}

function initAuthForms() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!loginForm.checkValidity()) {
        loginForm.classList.add("was-validated");
        return;
      }

      const submitButton = loginForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById("login-form-alert");
      const email = loginForm.elements.email.value.trim();
      const password = loginForm.elements.password.value;

      toggleButtonBusy(submitButton, true, "Выполняем вход...");
      hideAlert(feedback);

      try {
        const response = await fetchJson("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        saveSession({
          token: response.token,
          user: response.user
        });

        renderNavigationAuth();
        showAuthSuccessModal(
          response.message,
          getRequestedRedirect() || getCabinetPageByRole(response.user.role)
        );

        loginForm.reset();
        loginForm.classList.remove("was-validated");
      } catch (error) {
        setAlertMessage(feedback, error.message, "danger");
      } finally {
        toggleButtonBusy(submitButton, false, "Войти");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!registerForm.checkValidity()) {
        registerForm.classList.add("was-validated");
        return;
      }

      const submitButton = registerForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById("register-form-alert");
      const payload = {
        firstName: registerForm.elements.firstName.value.trim(),
        lastName: registerForm.elements.lastName.value.trim(),
        email: registerForm.elements.email.value.trim(),
        password: registerForm.elements.password.value,
        phone: registerForm.elements.phone.value.trim(),
        role: registerForm.elements.role.value
      };

      toggleButtonBusy(submitButton, true, "Создаём аккаунт...");
      hideAlert(feedback);

      try {
        const response = await fetchJson("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        saveSession({
          token: response.token,
          user: response.user
        });

        renderNavigationAuth();
        showAuthSuccessModal(
          response.message,
          getCabinetPageByRole(response.user.role)
        );

        registerForm.reset();
        registerForm.classList.remove("was-validated");
      } catch (error) {
        setAlertMessage(feedback, error.message, "danger");
      } finally {
        toggleButtonBusy(submitButton, false, "Зарегистрироваться");
      }
    });
  }
}

async function initHomePage() {
  const counter = document.getElementById("home-events-counter");
  if (!counter) return;

  const status = document.getElementById("home-api-status");

  try {
    const events = await fetchJson("/events");
    counter.textContent = String(events.length);
    if (status) {
      status.textContent = "Mock API подключено и отвечает.";
      status.className = "status-note text-success mb-0 mt-3";
    }
  } catch (error) {
    counter.textContent = "0";
    if (status) {
      status.textContent = "Mock API недоступно. Сначала запустите `npm run api`.";
      status.className = "status-note text-danger mb-0 mt-3";
    }
  }
}

async function initEventsPage() {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  const form = document.getElementById("event-filter-form");
  const resultsCount = document.getElementById("results-count");
  const loading = document.getElementById("events-loading");
  const feedback = document.getElementById("events-feedback");
  const emptyState = document.getElementById("empty-state");
  const resetButton = document.getElementById("reset-filters");

  let events = [];

  const render = () => {
    const filteredEvents = getFilteredEvents(events, form);
    renderEventsGrid(grid, filteredEvents);

    if (resultsCount) {
      resultsCount.textContent = String(filteredEvents.length);
    }

    emptyState?.classList.toggle("d-none", filteredEvents.length > 0);
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  resetButton?.addEventListener("click", () => {
    form?.reset();
    render();
  });

  try {
    events = await fetchJson("/events");
    loading?.classList.add("d-none");
    grid.setAttribute("aria-busy", "false");
    hideAlert(feedback);
    render();
  } catch (error) {
    loading?.classList.add("d-none");
    grid.setAttribute("aria-busy", "false");
    setAlertMessage(feedback, `${error.message} Запустите mock API командой \`npm run api\`.`, "danger");
  }
}

async function initEventPage() {
  const title = document.getElementById("event-title");
  if (!title) return;

  const loading = document.getElementById("event-loading");
  const feedback = document.getElementById("event-feedback");
  const purchaseButton = document.getElementById("open-purchase-modal");
  const confirmButton = document.getElementById("confirm-purchase");
  const selectedList = document.getElementById("selected-seats-list");
  const selectedCount = document.getElementById("selected-count");
  const modalSeatList = document.getElementById("modal-seat-list");
  const modalTotal = document.getElementById("modal-total");
  const successAlert = document.getElementById("purchase-success");

  const purchaseModalElement = document.getElementById("purchaseModal");
  const purchaseModal = purchaseModalElement ? new bootstrap.Modal(purchaseModalElement) : null;

  const selectedSeats = new Set();
  const eventId = getCurrentEventId();
  let currentEvent = null;

  const renderSelection = () => {
    const seats = Array.from(selectedSeats).sort();
    const hasSelection = seats.length > 0;

    if (selectedList) {
      selectedList.textContent = hasSelection ? seats.join(", ") : "места не выбраны";
    }

    if (selectedCount) {
      selectedCount.textContent = String(seats.length);
    }

    if (purchaseButton) {
      purchaseButton.disabled = !hasSelection;
      purchaseButton.setAttribute("aria-disabled", String(!hasSelection));
    }
  };

  const renderSeats = () => {
    const seatGrid = document.getElementById("seat-grid");
    if (!seatGrid || !currentEvent) return;

    const busySeats = new Set(currentEvent.unavailableSeats || []);

    seatGrid.innerHTML = currentEvent.allSeats
      .map((seat) => {
        const isBusy = busySeats.has(seat);
        const isSelected = selectedSeats.has(seat);
        const classNames = [
          "seat-btn",
          isBusy ? "unavailable" : "",
          isSelected ? "selected" : ""
        ].filter(Boolean).join(" ");

        return `
          <button
            type="button"
            class="${classNames}"
            data-seat="${seat}"
            aria-pressed="${isSelected ? "true" : "false"}"
            aria-disabled="${isBusy ? "true" : "false"}"
            aria-label="${escapeHtml(getSeatAriaLabel(seat, isBusy, isSelected))}"
            ${isBusy ? "disabled" : ""}
          >
            ${seat}
          </button>
        `;
      })
      .join("");
  };

  const bindSeatEvents = () => {
    const seatGrid = document.getElementById("seat-grid");
    if (!seatGrid) return;

    seatGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".seat-btn[data-seat]");
      if (!button || button.classList.contains("unavailable")) return;

      const seat = button.dataset.seat;
      if (selectedSeats.has(seat)) {
        selectedSeats.delete(seat);
      } else {
        selectedSeats.add(seat);
      }

      renderSeats();
      renderSelection();
    });
  };

  purchaseButton?.addEventListener("click", () => {
    const session = getSession();
    if (!session?.token) {
      window.location.href = `login.html?redirect=${encodeURIComponent(`event.html?id=${eventId}`)}`;
      return;
    }

    if (session.user.role !== "user") {
      setAlertMessage(feedback, "Покупка билетов доступна только для аккаунта покупателя.", "warning");
      return;
    }

    const seats = Array.from(selectedSeats).sort();
    if (modalSeatList) {
      modalSeatList.textContent = seats.join(", ");
    }

    if (modalTotal && currentEvent) {
      modalTotal.textContent = `${formatCurrency(seats.length * currentEvent.price)}`;
    }

    purchaseModal?.show();
  });

  confirmButton?.addEventListener("click", async () => {
    if (!currentEvent || selectedSeats.size === 0) return;

    const seats = Array.from(selectedSeats).sort();
    toggleButtonBusy(confirmButton, true, "Оплачиваем...");

    try {
      const response = await fetchJson("/tickets/purchase", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          eventId: currentEvent.id,
          seats
        })
      });

      purchaseModal?.hide();
      setAlertMessage(successAlert, response.message, "success");
      successAlert?.classList.remove("d-none");
      selectedSeats.clear();
      await loadEventDetails();
    } catch (error) {
      setAlertMessage(feedback, error.message, "danger");
    } finally {
      toggleButtonBusy(confirmButton, false, "Оплатить");
    }
  });

  const loadEventDetails = async () => {
    try {
      const response = await fetchJson(`/events/${eventId}`);
      currentEvent = response.event;

      fillEventPage(response.event, response.reviews, response.similarEvents);
      renderSeats();
      renderSelection();
      hideAlert(feedback);
      loading?.classList.add("d-none");
    } catch (error) {
      loading?.classList.add("d-none");
      setAlertMessage(feedback, error.message, "danger");
    }
  };

  bindSeatEvents();
  await loadEventDetails();
}

async function initUserCabinetPage() {
  const root = document.getElementById("user-cabinet-root");
  if (!root) return;

  const loading = document.getElementById("user-loading");
  const feedback = document.getElementById("user-page-feedback");
  const content = document.getElementById("user-content");
  const session = getSession();

  if (!session?.token) {
    loading?.classList.add("d-none");
    setAlertHtml(
      feedback,
      `Чтобы увидеть купленные билеты, сначала <a href="login.html?redirect=${encodeURIComponent("user-cabinet.html")}">войдите в аккаунт</a>.`,
      "warning"
    );
    return;
  }

  if (session.user.role !== "user") {
    loading?.classList.add("d-none");
    setAlertMessage(feedback, "Эта страница доступна только для аккаунта покупателя.", "warning");
    return;
  }

  try {
    const [profileResponse, ticketsResponse] = await Promise.all([
      fetchJson("/auth/profile", { headers: getAuthHeaders() }),
      fetchJson("/tickets/my", { headers: getAuthHeaders() })
    ]);

    renderUserProfile(profileResponse.user, profileResponse.stats);
    renderUserTickets(ticketsResponse.tickets);
    renderReturnHistory(ticketsResponse.returns);
    bindReturnButtons();

    content?.classList.remove("d-none");
    loading?.classList.add("d-none");
    hideAlert(feedback);
  } catch (error) {
    loading?.classList.add("d-none");
    setAlertMessage(feedback, error.message, "danger");
  }
}

async function initOrganizerCabinetPage() {
  const root = document.getElementById("organizer-cabinet-root");
  if (!root) return;

  const loading = document.getElementById("organizer-loading");
  const feedback = document.getElementById("organizer-page-feedback");
  const content = document.getElementById("organizer-content");
  const form = document.getElementById("organizer-event-form");
  const formAlert = document.getElementById("organizer-create-alert");
  const session = getSession();

  if (!session?.token) {
    loading?.classList.add("d-none");
    setAlertHtml(
      feedback,
      `Чтобы работать с кабинетом организатора, сначала <a href="login.html?redirect=${encodeURIComponent("organizer-cabinet.html")}">войдите в систему</a>.`,
      "warning"
    );
    return;
  }

  if (session.user.role !== "organizer") {
    loading?.classList.add("d-none");
    setAlertMessage(feedback, "Эта страница доступна только для аккаунта организатора.", "warning");
    return;
  }

  const loadDashboard = async () => {
    const response = await fetchJson("/organizer/dashboard", { headers: getAuthHeaders() });
    renderOrganizerDashboard(response);
    content?.classList.remove("d-none");
    loading?.classList.add("d-none");
  };

  try {
    await loadDashboard();
    hideAlert(feedback);
  } catch (error) {
    loading?.classList.add("d-none");
    setAlertMessage(feedback, error.message, "danger");
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const payload = {
      title: form.elements.title.value.trim(),
      type: form.elements.type.value,
      city: form.elements.city.value,
      place: form.elements.place.value.trim(),
      date: form.elements.date.value,
      price: Number(form.elements.price.value),
      description: form.elements.description.value.trim()
    };

    toggleButtonBusy(submitButton, true, "Сохраняем...");
    hideAlert(formAlert);

    try {
      const response = await fetchJson("/organizer/events", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      setAlertMessage(formAlert, response.message, "success");
      form.reset();
      form.classList.remove("was-validated");
      await loadDashboard();
    } catch (error) {
      setAlertMessage(formAlert, error.message, "danger");
    } finally {
      toggleButtonBusy(submitButton, false, "Добавить событие");
    }
  });
}

function fillEventPage(event, reviews, similarEvents) {
  const cover = document.getElementById("event-cover");
  const typeBadge = document.getElementById("event-type-badge");
  const dateChip = document.getElementById("event-datetime-chip");
  const locationChip = document.getElementById("event-location-chip");
  const title = document.getElementById("event-title");
  const description = document.getElementById("event-description");
  const infoDate = document.getElementById("event-info-date");
  const infoTime = document.getElementById("event-info-time");
  const infoVenue = document.getElementById("event-info-venue");
  const infoAddress = document.getElementById("event-info-address");
  const infoPrice = document.getElementById("event-info-price");
  const reviewsList = document.getElementById("reviews-list");
  const similarList = document.getElementById("similar-events");
  const availableStat = document.getElementById("event-availability");

  if (cover) {
    cover.src = event.image;
    cover.alt = event.title;
  }

  if (typeBadge) {
    typeBadge.textContent = event.typeLabel;
    typeBadge.className = `badge ${getBadgeClassByType(event.type)}`;
  }

  if (dateChip) {
    dateChip.innerHTML = `
      <span class="icon-text">
        ${renderSpriteIcon("calendar")}
        <span>${escapeHtml(formatEventDateTime(event.dateTime))}</span>
      </span>
    `;
  }

  if (locationChip) {
    locationChip.textContent = `${event.cityLabel}, ${event.venue}`;
  }

  if (title) {
    title.textContent = event.title;
  }

  if (description) {
    description.textContent = event.description;
  }

  if (infoDate) {
    infoDate.textContent = formatDate(event.dateTime);
  }

  if (infoTime) {
    infoTime.textContent = formatTime(event.dateTime);
  }

  if (infoVenue) {
    infoVenue.textContent = event.venue;
  }

  if (infoAddress) {
    infoAddress.textContent = event.address;
  }

  if (infoPrice) {
    infoPrice.textContent = `от ${formatCurrency(event.price)}`;
  }

  if (availableStat) {
    availableStat.textContent = `${event.seatsAvailable} из ${event.allSeats.length} мест свободно`;
  }

  if (reviewsList) {
    reviewsList.innerHTML = reviews.length
      ? reviews.map((review) => `
          <article class="review-card" role="listitem">
            <h3 class="h6 mb-1">${escapeHtml(review.author)}</h3>
            <p class="small text-secondary mb-2">Оценка: ${review.rating}/5</p>
            <p class="mb-0">${escapeHtml(review.text)}</p>
          </article>
        `).join("")
      : '<p class="mb-0 text-secondary">Пока нет отзывов. Станьте первым посетителем, который оценит это событие.</p>';
  }

  if (similarList) {
    similarList.innerHTML = similarEvents.length
      ? similarEvents.map((item) => `
          <a href="event.html?id=${item.id}" class="text-decoration-none d-block" role="listitem" aria-label="Открыть похожее событие: ${escapeHtml(item.title)}">
            ${escapeHtml(item.title)}, ${escapeHtml(formatDate(item.dateTime))}
          </a>
        `).join("")
      : '<p class="mb-0 text-secondary">Похожие события появятся позже.</p>';
  }
}

function renderEventsGrid(grid, events) {
  grid.innerHTML = events.map((event) => `
    <div class="col-md-6 event-card" role="listitem">
      <article class="card h-100" aria-labelledby="event-card-title-${event.id}">
        <img src="${event.image}" class="card-img-top event-card-image" alt="${escapeHtml(event.title)}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
            <span class="badge ${getBadgeClassByType(event.type)}">${escapeHtml(event.typeLabel)}</span>
            <span class="event-meta icon-text">
              ${renderSpriteIcon("calendar")}
              <span>${escapeHtml(formatDate(event.dateTime))}</span>
            </span>
          </div>
          <h2 id="event-card-title-${event.id}" class="h5">${escapeHtml(event.title)}</h2>
          <p class="text-secondary mb-2">${escapeHtml(event.cityLabel)}, ${escapeHtml(event.venue)}</p>
          <p class="small text-secondary mb-2 event-meta-inline">
            <span class="icon-text">
              ${renderSpriteIcon("ticket")}
              <span>От ${formatCurrency(event.price)}</span>
            </span>
            <span>Свободно мест: ${event.seatsAvailable}</span>
          </p>
          <p class="small text-secondary">${escapeHtml(shortText(event.description, 110))}</p>
          <a class="btn btn-outline-primary mt-auto" href="event.html?id=${event.id}">Подробнее</a>
        </div>
      </article>
    </div>
  `).join("");
}

function getFilteredEvents(events, form) {
  if (!form) return events;

  const type = form.elements.type.value;
  const city = form.elements.city.value;
  const datePeriod = form.elements.date.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter((event) => {
    const eventDate = new Date(event.dateTime);
    const typeMatch = type === "all" || event.type === type;
    const cityMatch = city === "all" || event.city === city;
    const dateMatch = matchesDateRange(eventDate, datePeriod, today);

    return typeMatch && cityMatch && dateMatch;
  });
}

function matchesDateRange(date, period, today) {
  if (period === "all") return true;

  const diff = date - today;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (period === "week") {
    return daysDiff >= 0 && daysDiff <= 7;
  }

  if (period === "month") {
    return daysDiff >= 0 && daysDiff <= 31;
  }

  return true;
}

function renderUserProfile(user, stats) {
  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const profilePhone = document.getElementById("profile-phone");
  const profileTickets = document.getElementById("profile-tickets-count");

  if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
  if (profileEmail) profileEmail.textContent = user.email;
  if (profilePhone) profilePhone.textContent = user.phone;
  if (profileTickets) profileTickets.textContent = String(stats.ticketsCount);
}

function renderUserTickets(tickets) {
  const list = document.getElementById("tickets-list");
  if (!list) return;

  const activeTickets = tickets.filter((ticket) => ticket.status === "paid");

  list.innerHTML = activeTickets.length
    ? activeTickets.map((ticket) => `
        <article class="card ticket-card" data-ticket-id="${ticket.id}" role="listitem" aria-labelledby="ticket-title-${ticket.id}">
          <div class="card-body p-4">
            <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
              <h2 id="ticket-title-${ticket.id}" class="h5 mb-0">${escapeHtml(ticket.event?.title || "Событие")}</h2>
              <span class="badge text-bg-success ticket-status">Оплачен</span>
            </div>
            <p class="event-meta mb-2">${escapeHtml(formatEventDateTime(ticket.event?.dateTime))} · ${escapeHtml(ticket.event?.venue || "-")} · Места: ${escapeHtml(ticket.seats.join(", "))}</p>
            <p class="small mb-3">Номер заказа: <strong>${escapeHtml(ticket.orderNumber)}</strong></p>
            <div class="d-flex flex-wrap gap-2">
              <a class="btn btn-outline-primary btn-sm" href="event.html?id=${ticket.eventId}">Открыть событие</a>
              <button type="button" class="btn btn-outline-danger btn-sm js-return-btn" data-ticket-id="${ticket.id}" data-order-number="${escapeHtml(ticket.orderNumber)}">Оформить возврат</button>
            </div>
          </div>
        </article>
      `).join("")
    : '<div class="card"><div class="card-body p-4 text-secondary">Активных билетов пока нет.</div></div>';
}

function renderReturnHistory(returns) {
  const list = document.getElementById("returns-list");
  if (!list) return;

  list.innerHTML = returns.length
    ? returns.map((item) => `
        <li class="list-group-item px-0">
          ${escapeHtml(item.ticket?.orderNumber || "Заказ")} · Статус: ${getReturnStatusLabel(item.status)}
        </li>
      `).join("")
    : '<li class="list-group-item px-0 text-secondary">История возвратов пока пуста.</li>';
}

function bindReturnButtons() {
  const returnButtons = Array.from(document.querySelectorAll(".js-return-btn"));
  if (!returnButtons.length) return;

  const label = document.getElementById("return-ticket-label");
  const confirmButton = document.getElementById("confirm-return-btn");
  const feedback = document.getElementById("user-page-feedback");
  const modalElement = document.getElementById("returnModal");
  const returnModal = modalElement ? new bootstrap.Modal(modalElement) : null;
  const toastElement = document.getElementById("return-toast");
  const toast = toastElement ? new bootstrap.Toast(toastElement) : null;

  let activeTicketId = "";
  let activeOrderNumber = "";

  returnButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTicketId = button.dataset.ticketId || "";
      activeOrderNumber = button.dataset.orderNumber || "";
      if (label) label.textContent = activeOrderNumber;
      returnModal?.show();
    });
  });

  confirmButton?.addEventListener("click", async () => {
    if (!activeTicketId) return;

    toggleButtonBusy(confirmButton, true, "Отправляем...");

    try {
      await fetchJson(`/tickets/${activeTicketId}/return`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      returnModal?.hide();
      toast?.show();
      window.setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error) {
      setAlertMessage(feedback, error.message, "danger");
    } finally {
      activeTicketId = "";
      activeOrderNumber = "";
      toggleButtonBusy(confirmButton, false, "Подтвердить возврат");
    }
  });
}

function renderOrganizerDashboard(response) {
  const organizerName = document.getElementById("organizer-name");
  const activeEvents = document.getElementById("stats-active-events");
  const soldTickets = document.getElementById("stats-sold-tickets");
  const revenue = document.getElementById("stats-revenue");
  const returns = document.getElementById("stats-returns");
  const salesBody = document.getElementById("sales-table-body");
  const eventsBody = document.getElementById("organizer-events-body");

  if (organizerName) {
    organizerName.textContent = `${response.organizer.firstName} ${response.organizer.lastName}`;
  }

  if (activeEvents) activeEvents.textContent = String(response.stats.activeEvents);
  if (soldTickets) soldTickets.textContent = formatNumber(response.stats.soldTickets);
  if (revenue) revenue.textContent = formatCompactCurrency(response.stats.revenue);
  if (returns) returns.textContent = `${response.stats.returnsPercent.toFixed(1)}%`;

  if (salesBody) {
    salesBody.innerHTML = response.sales.map((item) => `
      <tr>
        <th scope="row">${escapeHtml(item.title)}</th>
        <td>${formatNumber(item.soldTickets)}</td>
        <td>
          <div class="progress" role="progressbar" aria-label="Заполняемость ${escapeHtml(item.title)}" aria-valuenow="${item.occupancyPercent}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar ${getProgressBarClass(item.occupancyPercent)}" style="width: ${item.occupancyPercent}%">${item.occupancyPercent}%</div>
          </div>
        </td>
      </tr>
    `).join("");
  }

  if (eventsBody) {
    eventsBody.innerHTML = response.events.map((event) => `
      <tr>
        <th scope="row">${escapeHtml(event.title)}</th>
        <td>${escapeHtml(event.venue)}</td>
        <td>${escapeHtml(formatDate(event.dateTime))}</td>
        <td>${formatCurrency(event.price)}</td>
        <td><span class="badge ${event.status === "published" ? "text-bg-success" : "text-bg-warning"}">${event.status === "published" ? "Опубликовано" : "Черновик"}</span></td>
      </tr>
    `).join("");
  }
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload?.message
      ? payload.message
      : "Не удалось выполнить запрос к API.";
    throw new Error(message);
  }

  return payload;
}

function getAuthHeaders() {
  const session = getSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

function showAuthSuccessModal(message, href) {
  const modalElement = document.getElementById("authSuccessModal");
  const modalText = document.getElementById("auth-success-text");
  const modalLink = document.getElementById("auth-success-link");

  if (modalText) {
    modalText.textContent = message;
  }

  if (modalLink) {
    modalLink.href = href;
    modalLink.textContent = href.includes("organizer")
      ? "Перейти в кабинет организатора"
      : href.includes("user-cabinet")
        ? "Перейти в кабинет"
        : "Продолжить";
  }

  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

function toggleButtonBusy(button, isBusy, labelWhenIdle) {
  if (!button) return;

  if (!button.dataset.originalLabel) {
    button.dataset.originalLabel = button.textContent.trim();
  }

  button.disabled = isBusy;
  button.setAttribute("aria-disabled", String(isBusy));
  button.setAttribute("aria-busy", String(isBusy));
  button.textContent = isBusy ? labelWhenIdle || "Загрузка..." : button.dataset.originalLabel;
}

function setAlertMessage(element, message, variant = "secondary") {
  if (!element) return;

  if (!message) {
    hideAlert(element);
    return;
  }

  element.className = `alert alert-${variant}`;
  element.textContent = message;
  applyAlertAccessibility(element, variant);
}

function setAlertHtml(element, message, variant = "secondary") {
  if (!element) return;

  if (!message) {
    hideAlert(element);
    return;
  }

  element.className = `alert alert-${variant}`;
  element.innerHTML = message;
  applyAlertAccessibility(element, variant);
}

function hideAlert(element) {
  if (!element) return;

  element.className = "alert d-none";
  element.textContent = "";
  element.removeAttribute("role");
  element.removeAttribute("aria-live");
  element.removeAttribute("aria-atomic");
  element.removeAttribute("tabindex");
}

function getCurrentEventId() {
  const params = new URLSearchParams(window.location.search);
  const rawId = Number(params.get("id"));
  return Number.isFinite(rawId) && rawId > 0 ? rawId : 1;
}

function getCabinetPageByRole(role) {
  return role === "organizer" ? "organizer-cabinet.html" : "user-cabinet.html";
}

function getRequestedRedirect() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (!redirect) return "";

  return KNOWN_PAGES.some((page) => redirect.startsWith(page)) ? redirect : "";
}

function getBadgeClassByType(type) {
  const map = {
    concert: "text-bg-primary",
    theater: "text-bg-danger",
    festival: "text-bg-warning",
    sport: "text-bg-success"
  };

  return map[type] || "text-bg-secondary";
}

function getProgressBarClass(value) {
  if (value >= 75) return "bg-success";
  if (value >= 45) return "bg-warning";
  return "bg-primary";
}

function getReturnStatusLabel(status) {
  return status === "completed" ? "Завершён" : "В обработке";
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatEventDateTime(value) {
  if (!value) return "-";
  return `${formatDate(value)}, ${formatTime(value)}`;
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("ru-RU")} ₽`;
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value || 0)) + " ₽";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ru-RU");
}

function renderSpriteIcon(name) {
  const safeName = String(name || "").trim().toLowerCase();
  if (!safeName) return "";

  return `<svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#icon-${safeName}"></use></svg>`;
}

function applyAlertAccessibility(element, variant) {
  const isAssertive = variant === "danger" || variant === "warning";
  element.setAttribute("role", isAssertive ? "alert" : "status");
  element.setAttribute("aria-live", isAssertive ? "assertive" : "polite");
  element.setAttribute("aria-atomic", "true");
  element.setAttribute("tabindex", "-1");

  if (isAssertive) {
    window.requestAnimationFrame(() => {
      element.focus({ preventScroll: false });
    });
  }
}

function getSeatAriaLabel(seat, isBusy, isSelected) {
  if (isBusy) {
    return `Место ${seat}, недоступно`;
  }

  if (isSelected) {
    return `Место ${seat}, выбрано`;
  }

  return `Место ${seat}, доступно`;
}

function shortText(text, maxLength) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
