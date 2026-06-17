(function initHomeActionsModule() {
  const root = window;
  root.EventPassHome = root.EventPassHome || {};

  const data = root.EventPassHome.data || {};
  const organizers = root.EventPassHome.organizers || {};
  const ui = root.EventPassHome.ui || {};
  const actions = {};

  actions.initHomeNavAuthState = async function initHomeNavAuthState() {
    const guestNavActions = document.getElementById("guestNavActions");
    const userNavActions = document.getElementById("userNavActions");
    const userCabinetLink = document.getElementById("userCabinetLink");

    if (!guestNavActions || !userNavActions || !userCabinetLink) {
      return;
    }

    const currentUser = await getCurrentUser();
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
  };

  actions.showPurchaseToast = function showPurchaseToast(message, isSuccess) {
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
  };

  actions.buildTicketFromButton = function buildTicketFromButton(button) {
    return {
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
  };

  actions.purchaseTicketForCurrentUser = async function purchaseTicketForCurrentUser(ticket) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      window.location.href = "auth.html";
      return {
        ok: false,
        redirect: true,
      };
    }

    if (currentUser.accountType === "organizer") {
      return {
        ok: false,
        message: "С аккаунта организатора нельзя купить билет.",
      };
    }

    if (!currentUser.id) {
      clearCurrentUserId();
      window.location.href = "auth.html";
      return {
        ok: false,
        redirect: true,
      };
    }

    const nextUser = {
      ...currentUser,
      tickets: [ticket, ...(Array.isArray(currentUser.tickets) ? currentUser.tickets : [])],
      refunds: Array.isArray(currentUser.refunds) ? currentUser.refunds : [],
      organizerEvents: Array.isArray(currentUser.organizerEvents) ? currentUser.organizerEvents : [],
    };

    await persistUserToApi(nextUser);

    return {
      ok: true,
    };
  };

  actions.initHomePurchaseActions = function initHomePurchaseActions() {
    const buyButtons = document.querySelectorAll('.buy-ticket-btn:not([data-purchase-bound="1"])');
    if (!buyButtons.length) {
      return;
    }

    buyButtons.forEach((button) => {
      button.dataset.purchaseBound = "1";
      button.addEventListener("click", async () => {
        button.disabled = true;

        try {
          const ticket = actions.buildTicketFromButton(button);
          const result = await actions.purchaseTicketForCurrentUser(ticket);

          if (result && result.ok) {
            actions.showPurchaseToast("Билет куплен.", true);
          } else if (result && result.message) {
            actions.showPurchaseToast(result.message, false);
          }
        } catch (error) {
          actions.showPurchaseToast(error.message || "Не удалось купить билет. Попробуйте позже.", false);
        } finally {
          button.disabled = false;
        }
      });
    });
  };

  actions.readSearchFilters = function readSearchFilters() {
    const searchEventInput = document.getElementById("searchEvent");
    const searchDateInput = document.getElementById("searchDate");
    const searchCitySelect = document.getElementById("searchCity");

    return {
      searchText: String(searchEventInput && searchEventInput.value ? searchEventInput.value : "").trim(),
      selectedDate: String(searchDateInput && searchDateInput.value ? searchDateInput.value : "").trim(),
      selectedCity: String(searchCitySelect && searchCitySelect.value ? searchCitySelect.value : "").trim(),
    };
  };

  actions.buildSearchLocations = function buildSearchLocations(filters) {
    const selectedLocationCode = data.resolveKudaGoLocationCode(filters.selectedCity);
    const textLocationCode = selectedLocationCode ? "" : data.resolveKudaGoLocationCode(filters.searchText);
    const normalizedSearch = data.normalizeCityToken(filters.searchText);
    const normalizedCityOnly = data.normalizeCityToken(data.KUDAGO_LOCATION_LABELS[textLocationCode] || "");
    const queryText = textLocationCode && normalizedSearch === normalizedCityOnly ? "" : filters.searchText;
    const locations = selectedLocationCode
      ? [selectedLocationCode]
      : textLocationCode
        ? [textLocationCode]
        : Object.keys(data.KUDAGO_LOCATION_LABELS);

    return {
      locations,
      queryText,
    };
  };

  actions.runHomeSearch = async function runHomeSearch(filters) {
    const searchConfig = actions.buildSearchLocations(filters);

    const sourceItems = await data.fetchKudaGoByLocations({
      locations: searchConfig.locations,
      searchQuery: searchConfig.queryText,
      pageSize: data.KUDAGO_SEARCH_LIMIT,
    });

    let events = sourceItems.map((item) => data.toKudaGoEventViewModel(item));
    if (filters.selectedDate) {
      events = events.filter((item) => item.dateIso === filters.selectedDate);
    }

    events = events.slice(0, data.KUDAGO_SEARCH_LIMIT);

    const organizerEvents = await organizers.getOrganizerEventsForHome(filters);

    ui.renderEventsList(events, {
      useLoadMore: true,
      batchSize: 9,
      emptyMessage: "По вашему запросу ничего не найдено.",
      organizerEvents,
    });
  };

  actions.initHomeEventSearch = function initHomeEventSearch() {
    const searchPanel = document.querySelector(".search-panel");
    const searchCitySelect = document.getElementById("searchCity");
    const searchButton = searchPanel ? searchPanel.querySelector('button[type="button"]') : null;

    if (!searchPanel || !searchCitySelect || !searchButton) {
      return;
    }

    const cities = Object.values(data.KUDAGO_LOCATION_LABELS);
    cities.forEach((city) => {
      const exists = Array.from(searchCitySelect.options).some(
        (option) => data.normalizeCityToken(option.value) === data.normalizeCityToken(city)
      );

      if (!exists) {
        searchCitySelect.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`);
      }
    });

    async function handleSearch(event) {
      if (event) {
        event.preventDefault();
      }

      const filters = actions.readSearchFilters();
      if (!filters.searchText && !filters.selectedDate && !filters.selectedCity) {
        await actions.loadKudaGoEvents();
        return;
      }

      searchButton.disabled = true;
      ui.showEventsStatus("Ищем мероприятия по API...", false);

      try {
        await actions.runHomeSearch(filters);
      } catch (error) {
        ui.showEventsStatus(error.message || "Не удалось выполнить поиск по API.", true);
      } finally {
        searchButton.disabled = false;
      }
    }

    if (searchPanel.dataset.searchBound !== "1") {
      searchButton.addEventListener("click", handleSearch);
      searchPanel.addEventListener("submit", handleSearch);
      searchPanel.dataset.searchBound = "1";
    }
  };

  actions.loadKudaGoEvents = async function loadKudaGoEvents() {
    ui.showEventsStatus("Загружаем мероприятия...", false);

    try {
      const organizerEvents = await organizers.getOrganizerEventsForHome();
      const sourceItems = await data.fetchKudaGoByLocations({
        locations: Object.keys(data.KUDAGO_LOCATION_LABELS),
        searchQuery: "",
        pageSize: 15,
      });

      const events = sourceItems.map((item) => data.toKudaGoEventViewModel(item)).slice(0, 30);
      ui.renderEventsList(events, {
        useLoadMore: true,
        batchSize: 9,
        emptyMessage: "Пока нет мероприятий.",
        organizerEvents,
      });
    } catch (error) {
      const organizerEvents = await organizers.getOrganizerEventsForHome();
      ui.renderEventsList([], {
        useLoadMore: true,
        batchSize: 9,
        emptyMessage: "Пока нет мероприятий.",
        organizerEvents,
      });
    }
  };

  actions.bootstrapHome = async function bootstrapHome() {
    await actions.initHomeNavAuthState();
    await actions.loadKudaGoEvents();
  };

  root.EventPassHome.actions = actions;
})();
