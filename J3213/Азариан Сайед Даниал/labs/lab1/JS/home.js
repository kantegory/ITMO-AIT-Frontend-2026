function initHomeNavAuthState() {
  const guestNavActions = document.getElementById("guestNavActions");
  const userNavActions = document.getElementById("userNavActions");
  const userCabinetLink = document.getElementById("userCabinetLink");

  if (!guestNavActions || !userNavActions || !userCabinetLink) {
    return;
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    const cabinetUrl = getCabinetUrlForUser(currentUser);
    userCabinetLink.href = cabinetUrl;
    userCabinetLink.textContent = currentUser.accountType === "organizer" ? "Кабинет организатора" : "Личный кабинет";

    guestNavActions.classList.add("d-none");
    userNavActions.classList.remove("d-none");
    userNavActions.classList.add("d-flex");
  } else {
    guestNavActions.classList.remove("d-none");
    guestNavActions.classList.add("d-flex");
    userNavActions.classList.add("d-none");
    userNavActions.classList.remove("d-flex");
  }
}

function initHomePurchaseActions() {
  const buyButtons = document.querySelectorAll(".buy-ticket-btn");
  if (!buyButtons.length) {
    return;
  }

  function showPurchaseToast(message, isSuccess) {
    const existingToast = document.getElementById("purchaseResultToast");
    if (existingToast) {
      existingToast.remove();
    }

    const toastHtml = `
      <div id="purchaseResultToast" class="toast align-items-center text-bg-${isSuccess ? "success" : "danger"} border-0 position-fixed top-0 end-0 m-3" role="status" aria-live="polite" aria-atomic="true" style="z-index: 1080;">
        <div class="d-flex">
          <div class="toast-body">${escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", toastHtml);

    const toastElement = document.getElementById("purchaseResultToast");
    if (!toastElement) {
      return;
    }

    const toast = new bootstrap.Toast(toastElement, {
      delay: 2200,
      autohide: true,
    });

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });

    toast.show();
  }

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        window.location.href = "auth.html";
        return;
      }
      if (currentUser.accountType === "organizer") {
        showPurchaseToast("С аккаунта организатора нельзя купить билет.", false);
        return;
      }

      const users = loadUsers();
      const userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex < 0) {
        clearCurrentUserId();
        window.location.href = "auth.html";
        return;
      }

      const ticket = {
        id: `EP-${String(Date.now()).slice(-6)}`,
        category: button.dataset.category || "Мероприятие",
        eventName: button.dataset.eventName || "Событие",
        date: button.dataset.date || "Скоро",
        city: button.dataset.city || "Не указан",
        seat: button.dataset.seat || "Электронный билет",
        price: Number(button.dataset.price || 0),
        status: "paid",
        canRefund: true,
      };

      users[userIndex].tickets = Array.isArray(users[userIndex].tickets) ? users[userIndex].tickets : [];
      users[userIndex].tickets.unshift(ticket);
      saveUsers(users);

      showPurchaseToast("Билет куплен.", true);
    });
  });
}

function initHomeOrganizerEvents() {
  const eventsGrid = document.getElementById("eventsGrid");
  if (!eventsGrid) {
    return;
  }

  eventsGrid.querySelectorAll(".organizer-event-card").forEach((node) => node.remove());

  const users = loadUsers();
  const organizerEvents = users
    .filter((user) => user.accountType === "organizer" && Array.isArray(user.organizerEvents))
    .flatMap((user) =>
      user.organizerEvents.map((eventItem, index) => ({
        organizerName: user.name,
        id: eventItem.id || `${user.id}_event_${index}`,
        name: eventItem.name || "Новое событие",
        category: eventItem.category || "Мероприятие",
        date: eventItem.date || "Скоро",
        dateIso: eventItem.dateIso || "",
        city: eventItem.city || "Не указан",
        venue: eventItem.venue || "Площадка уточняется",
        price: Number(eventItem.price || 0),
      }))
    );

  organizerEvents.forEach((eventItem) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "col-sm-6 col-lg-4 organizer-event-card";
    cardWrapper.innerHTML = `
      <article class="event-card h-100">
        <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" class="event-card-img" alt="${escapeHtml(eventItem.category)}">
        <div class="p-3">
          <p class="small text-secondary mb-2">${escapeHtml(eventItem.category)} • ${escapeHtml(eventItem.date)} • ${escapeHtml(eventItem.city)}</p>
          <h3 class="h5"><a class="text-decoration-none text-dark" href="event.html?event=organizer-${encodeURIComponent(eventItem.id)}">${escapeHtml(eventItem.name)}</a></h3>
          <p class="text-secondary mb-3">${escapeHtml(eventItem.venue)} • Организатор: ${escapeHtml(eventItem.organizerName)}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-semibold">от ${eventItem.price.toLocaleString("ru-RU")} ₽</span>
            <button
              class="btn btn-sm btn-outline-primary buy-ticket-btn"
              type="button"
              data-event-name="${escapeHtml(eventItem.name)}"
              data-category="${escapeHtml(eventItem.category)}"
              data-date="${escapeHtml(eventItem.date)}"
              data-date-iso="${escapeHtml(eventItem.dateIso)}"
              data-city="${escapeHtml(eventItem.city)}"
              data-seat="Электронный билет"
              data-price="${eventItem.price}"
            >
              Купить
            </button>
          </div>
        </div>
      </article>
    `;

    eventsGrid.appendChild(cardWrapper);
  });
}

function initHomeEventSearch() {
  const searchPanel = document.querySelector(".search-panel");
  const searchEventInput = document.getElementById("searchEvent");
  const searchDateInput = document.getElementById("searchDate");
  const searchCitySelect = document.getElementById("searchCity");
  const searchButton = searchPanel ? searchPanel.querySelector('button[type="button"]') : null;
  const eventCards = Array.from(document.querySelectorAll(".event-card"));

  if (!searchPanel || !searchEventInput || !searchDateInput || !searchCitySelect || !searchButton || !eventCards.length) {
    return;
  }

  function syncCityOptions() {
    const citySet = new Set();

    eventCards.forEach((card) => {
      const buyButton = card.querySelector(".buy-ticket-btn");
      const city = (buyButton && buyButton.dataset.city ? buyButton.dataset.city : "").trim();
      if (city) {
        citySet.add(city);
      }
    });

    const cityOptions = Array.from(citySet).sort((a, b) => a.localeCompare(b, "ru-RU"));
    searchCitySelect.innerHTML = '<option value="" selected>Все города</option>';
    cityOptions.forEach((city) => {
      searchCitySelect.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`);
    });
  }

  syncCityOptions();
  searchCitySelect.value = "";

  const noResultsMessage = document.createElement("div");
  noResultsMessage.className = "col-12 d-none";
  noResultsMessage.innerHTML = '<div class="alert alert-light border mb-0">По вашему запросу мероприятий не найдено.</div>';

  const cardsRow = eventCards[0].parentElement ? eventCards[0].parentElement.parentElement : null;
  if (cardsRow) {
    cardsRow.appendChild(noResultsMessage);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function parseRuDateToIso(dateString) {
    const normalized = normalize(dateString);
    const months = {
      "января": "01",
      "февраля": "02",
      "марта": "03",
      "апреля": "04",
      "мая": "05",
      "июня": "06",
      "июля": "07",
      "августа": "08",
      "сентября": "09",
      "октября": "10",
      "ноября": "11",
      "декабря": "12",
    };

    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length < 3) {
      return "";
    }

    const day = parts[0].padStart(2, "0");
    const month = months[parts[1]];
    const year = parts[2];
    if (!month || !/^\d{4}$/.test(year) || !/^\d{2}$/.test(day)) {
      return "";
    }

    return `${year}-${month}-${day}`;
  }

  function applyFilters() {
    const searchText = normalize(searchEventInput.value);
    const selectedDate = searchDateInput.value;
    const selectedCity = normalize(searchCitySelect.value);
    let visibleCount = 0;

    eventCards.forEach((card) => {
      const buyButton = card.querySelector(".buy-ticket-btn");
      if (!buyButton) {
        return;
      }

      const title = normalize(buyButton.dataset.eventName);
      const category = normalize(buyButton.dataset.category);
      const city = normalize(buyButton.dataset.city);
      const eventDateIso = buyButton.dataset.dateIso || parseRuDateToIso(buyButton.dataset.date);

      const matchesText = !searchText || title.includes(searchText) || category.includes(searchText);
      const matchesCity = !selectedCity || city === selectedCity;
      const matchesDate = !selectedDate || eventDateIso === selectedDate;
      const isVisible = matchesText && matchesCity && matchesDate;

      const cardColumn = card.closest(".col-sm-6");
      if (cardColumn) {
        cardColumn.classList.toggle("d-none", !isVisible);
      }

      if (isVisible) {
        visibleCount += 1;
      }
    });

    noResultsMessage.classList.toggle("d-none", visibleCount > 0);
  }

  searchButton.addEventListener("click", applyFilters);
  searchPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });
}

initHomeOrganizerEvents();
initHomeNavAuthState();
initHomePurchaseActions();
initHomeEventSearch();
