(function (global) {
  const catalogContainer = document.getElementById('eventsCatalog');
  const searchInput = document.getElementById('catalogSearch');
  const categorySelect = document.getElementById('catalogCategory');
  const citySelect = document.getElementById('catalogCity');
  const dateFromInput = document.getElementById('catalogDateFrom');
  const dateToInput = document.getElementById('catalogDateTo');
  const priceRangeInput = document.getElementById('catalogPriceRange');
  const priceValue = document.getElementById('catalogPriceValue');
  const onlyAvailableCheckbox = document.getElementById('catalogOnlyAvailable');
  const sortSelect = document.getElementById('catalogSort');
  const resetButton = document.getElementById('catalogResetButton');
  const titleElement = document.getElementById('catalogTitle');
  const mobileCategorySelect = document.getElementById('catalogCategoryMobile');
  const mobileCitySelect = document.getElementById('catalogCityMobile');
  const mobileApplyButton = document.getElementById('catalogMobileApplyButton');

  if (!catalogContainer || !global.KontramarkaEventsService) {
    return;
  }

  const { getEvents } = global.KontramarkaEventsService;
  let allEvents = [];
  const defaultFilters = {
    search: '',
    category: 'Все',
    city: 'Все',
    dateFrom: '',
    dateTo: '',
    maxPrice: 20000,
    onlyAvailable: true,
    sort: 'Сначала популярные'
  };

  function getCurrentFilters() {
    return {
      search: searchInput?.value.trim().toLowerCase() || '',
      category: categorySelect?.value || defaultFilters.category,
      city: citySelect?.value || defaultFilters.city,
      dateFrom: dateFromInput?.value || '',
      dateTo: dateToInput?.value || '',
      maxPrice: Number(priceRangeInput?.value || defaultFilters.maxPrice),
      onlyAvailable: Boolean(onlyAvailableCheckbox?.checked),
      sort: sortSelect?.value || defaultFilters.sort
    };
  }

  function isPublishedEvent(event) {
    const status = event.status || 'Опубликовано';
    return status === 'Опубликовано';
  }

  function formatEventDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  function getEventDetailsUrl(event) {
    return `event.html?id=${event.id}`;
  }

  function renderState(message, stateClass) {
    catalogContainer.innerHTML = `
      <div class="col-12">
        <div class="border rounded-4 p-4 text-center ${stateClass}">
          ${message}
        </div>
      </div>
    `;
  }

  function updateCatalogTitle(count) {
    if (!titleElement) {
      return;
    }

    titleElement.textContent = count > 0 ? `Мероприятия: ${count}` : 'Мероприятия';
  }

  function updatePriceLabel(value) {
    if (!priceValue) {
      return;
    }

    priceValue.textContent = `${Number(value).toLocaleString('ru-RU')} ₽`;
  }

  function syncMobileFilters() {
    if (mobileCategorySelect && categorySelect) {
      mobileCategorySelect.value = categorySelect.value;
    }

    if (mobileCitySelect && citySelect) {
      mobileCitySelect.value = citySelect.value;
    }
  }

  function syncDesktopFilters() {
    if (mobileCategorySelect && categorySelect) {
      categorySelect.value = mobileCategorySelect.value;
    }

    if (mobileCitySelect && citySelect) {
      citySelect.value = mobileCitySelect.value;
    }
  }

  function resetFilters() {
    if (searchInput) searchInput.value = defaultFilters.search;
    if (categorySelect) categorySelect.value = defaultFilters.category;
    if (citySelect) citySelect.value = defaultFilters.city;
    if (dateFromInput) dateFromInput.value = defaultFilters.dateFrom;
    if (dateToInput) dateToInput.value = defaultFilters.dateTo;
    if (priceRangeInput) priceRangeInput.value = String(defaultFilters.maxPrice);
    if (onlyAvailableCheckbox) onlyAvailableCheckbox.checked = defaultFilters.onlyAvailable;
    if (sortSelect) sortSelect.value = defaultFilters.sort;

    updatePriceLabel(defaultFilters.maxPrice);
    syncMobileFilters();
  }

  function matchesSearch(event, search) {
    if (!search) {
      return true;
    }

    const searchableText = [
      event.title,
      event.description,
      event.city,
      event.venue,
      event.category
    ].join(' ').toLowerCase();

    return searchableText.includes(search);
  }

  function matchesDateRange(event, dateFrom, dateTo) {
    if (!dateFrom && !dateTo) {
      return true;
    }

    const eventDate = event.date;

    if (dateFrom && eventDate < dateFrom) {
      return false;
    }

    if (dateTo && eventDate > dateTo) {
      return false;
    }

    return true;
  }

  function sortEvents(events, sortValue) {
    const sortedEvents = [...events];

    if (sortValue === 'Сначала дешёвые') {
      sortedEvents.sort((left, right) => left.price - right.price);
      return sortedEvents;
    }

    if (sortValue === 'Сначала ближайшие') {
      sortedEvents.sort((left, right) => {
        const leftDateTime = new Date(`${left.date}T${left.time}`);
        const rightDateTime = new Date(`${right.date}T${right.time}`);
        return leftDateTime - rightDateTime;
      });
      return sortedEvents;
    }

    return sortedEvents;
  }

  function filterEvents(events) {
    const filters = getCurrentFilters();

    return sortEvents(events.filter((event) => {
      if (!isPublishedEvent(event)) {
        return false;
      }

      if (!matchesSearch(event, filters.search)) {
        return false;
      }

      if (filters.category !== 'Все' && event.category !== filters.category) {
        return false;
      }

      if (filters.city !== 'Все' && event.city !== filters.city) {
        return false;
      }

      if (!matchesDateRange(event, filters.dateFrom, filters.dateTo)) {
        return false;
      }

      if (event.price > filters.maxPrice) {
        return false;
      }

      if (filters.onlyAvailable && event.availableTickets <= 0) {
        return false;
      }

      return true;
    }), filters.sort);
  }

  function createEventCard(event) {
    return `
      <div class="col">
        <div class="card card-hover h-100 rounded-4 overflow-hidden">
          <img
            src="${event.image}"
            class="card-img-top"
            alt="${event.title}"
            style="height: 180px; object-fit: cover;"
          >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 class="h6 mb-1">${event.title}</h3>
                <div class="text-secondary small event-card-meta">
                  <span class="event-card-meta__item">
                    <svg class="icon" aria-hidden="true">
                      <use href="assets/icons/sprite.svg#icon-location"></use>
                    </svg>
                    <span>${event.city} • ${event.venue}</span>
                  </span>
                  <span class="event-card-meta__item">
                    <svg class="icon" aria-hidden="true">
                      <use href="assets/icons/sprite.svg#icon-calendar"></use>
                    </svg>
                    <span>${formatEventDate(event.date)} • ${event.time}</span>
                  </span>
                </div>
              </div>
              <span class="badge bg-body-tertiary border">${event.category}</span>
            </div>
            <p class="mt-3 mb-0 text-secondary text-truncate-2">
              ${event.description}
            </p>
          </div>
          <div class="card-footer bg-transparent border-top-0 pt-0 pb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">от ${event.price.toLocaleString('ru-RU')} ₽</div>
              <div class="d-flex gap-2">
                <a class="btn btn-sm btn-outline-secondary" href="${getEventDetailsUrl(event)}">Подробнее</a>
                <button
                  class="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#buyModal"
                  data-buy="e${event.id}"
                  data-event-id="${event.id}"
                  data-title="${event.title}"
                  data-price="${event.price}"
                  data-available-tickets="${event.availableTickets}"
                >
                  Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEvents(events) {
    updateCatalogTitle(events.length);
    catalogContainer.innerHTML = events.map(createEventCard).join('');
  }

  function renderFilteredEvents() {
    const filteredEvents = filterEvents(allEvents);

    if (!filteredEvents.length) {
      updateCatalogTitle(0);
      renderState('По выбранным фильтрам ничего не найдено.', 'text-secondary');
      return;
    }

    renderEvents(filteredEvents);
  }

  function bindFilters() {
    const filterControls = [
      searchInput,
      categorySelect,
      citySelect,
      dateFromInput,
      dateToInput,
      priceRangeInput,
      onlyAvailableCheckbox,
      sortSelect
    ].filter(Boolean);

    filterControls.forEach((control) => {
      const eventName = control === searchInput || control === priceRangeInput ? 'input' : 'change';
      control.addEventListener(eventName, () => {
        if (control === priceRangeInput) {
          updatePriceLabel(control.value);
        }

        if (control === categorySelect || control === citySelect) {
          syncMobileFilters();
        }

        renderFilteredEvents();
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        resetFilters();
        renderFilteredEvents();
      });
    }

    if (mobileApplyButton) {
      mobileApplyButton.addEventListener('click', () => {
        syncDesktopFilters();
        renderFilteredEvents();
      });
    }
  }

  async function initCatalogPage() {
    renderState('Загрузка мероприятий...', 'text-secondary');
    updatePriceLabel(defaultFilters.maxPrice);
    syncMobileFilters();
    bindFilters();

    try {
      const events = await getEvents();

      if (!Array.isArray(events) || events.length === 0) {
        renderState('Пока нет доступных мероприятий.', 'text-secondary');
        return;
      }

      allEvents = events;
      renderFilteredEvents();
    } catch (error) {
      console.error('Catalog loading failed.', error);
      updateCatalogTitle(0);
      renderState('Не удалось загрузить мероприятия. Попробуйте позже.', 'text-danger');
    }
  }

  initCatalogPage();
})(window);
