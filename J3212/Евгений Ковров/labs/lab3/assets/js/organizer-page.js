(function (global) {
  const pageRequired = [
    document.getElementById('organizerEventsTableBody'),
    document.getElementById('createEventForm'),
    document.getElementById('organizerSettingsForm'),
    global.KontramarkaApi,
    global.KontramarkaAuth
  ];

  if (pageRequired.some((item) => !item)) {
    return;
  }

  const { apiClient } = global.KontramarkaApi;
  const { isAuthenticated } = global.KontramarkaAuth;
  const tableBody = document.getElementById('organizerEventsTableBody');
  const searchInput = document.getElementById('organizerSearchInput');
  const statusFilter = document.getElementById('organizerStatusFilter');
  const activeEventsValue = document.getElementById('organizerActiveEvents');
  const soldTicketsValue = document.getElementById('organizerSoldTickets');
  const refundsValue = document.getElementById('organizerRefunds');
  const currentBalanceValue = document.getElementById('organizerCurrentBalance');
  const pendingPayoutValue = document.getElementById('organizerPendingPayout');

  const settingsForm = document.getElementById('organizerSettingsForm');
  const organizerNameInput = document.getElementById('organizerNameInput');
  const organizerEmailInput = document.getElementById('organizerEmailInput');
  const organizerPhoneInput = document.getElementById('organizerPhoneInput');
  const organizerSettingsMessage = document.getElementById('organizerSettingsMessage');
  const organizerSettingsSaveButton = document.getElementById('organizerSettingsSaveButton');

  const createEventModalElement = document.getElementById('createEventModal');
  const createEventModalTitle = createEventModalElement?.querySelector('.modal-title');
  const createEventForm = document.getElementById('createEventForm');
  const createEventTitle = document.getElementById('createEventTitle');
  const createEventCategory = document.getElementById('createEventCategory');
  const createEventCity = document.getElementById('createEventCity');
  const createEventVenue = document.getElementById('createEventVenue');
  const createEventDate = document.getElementById('createEventDate');
  const createEventTime = document.getElementById('createEventTime');
  const createEventCapacity = document.getElementById('createEventCapacity');
  const createEventPrice = document.getElementById('createEventPrice');
  const createEventAge = document.getElementById('createEventAge');
  const createEventDescription = document.getElementById('createEventDescription');
  const createEventImage = document.getElementById('createEventImage');
  const createEventMessage = document.getElementById('createEventMessage');
  const createEventSaveButton = document.getElementById('createEventSaveButton');

  const manageModalElement = document.getElementById('manageModal');
  const manageEventTitle = document.getElementById('manageEventTitle');
  const manageEventMessage = document.getElementById('manageEventMessage');
  const manageEditButton = document.getElementById('manageEditButton');
  const manageSalesButton = document.getElementById('manageSalesButton');
  const managePauseButton = document.getElementById('managePauseButton');
  const manageUnpublishButton = document.getElementById('manageUnpublishButton');

  const payoutModalElement = document.getElementById('payoutModal');
  const payoutAvailableAmount = document.getElementById('payoutAvailableAmount');
  const payoutAmountInput = document.getElementById('payoutAmountInput');
  const payoutAccountInput = document.getElementById('payoutAccountInput');
  const payoutMessage = document.getElementById('payoutMessage');
  const payoutSubmitButton = document.getElementById('payoutSubmitButton');

  const SETTINGS_STORAGE_KEY = 'kontramarkaOrganizerSettings';
  const PAYOUTS_STORAGE_KEY = 'kontramarkaOrganizerPayouts';
  let organizerEvents = [];
  let editingEventId = null;
  let activeManageEventId = null;

  function getEventStatus(event) {
    return event?.status || 'Опубликовано';
  }

  function getLoginRedirectUrl() {
    return `login.html?redirect=${encodeURIComponent('organizer.html')}`;
  }

  function formatCurrency(value) {
    return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
  }

  function formatShortDate(date, time) {
    const parsedDate = new Date(`${date}T${time || '00:00'}`);

    if (Number.isNaN(parsedDate.getTime())) {
      return `${date} ${time || ''}`.trim();
    }

    return `${parsedDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${time || ''}`.trim();
  }

  function showMessage(element, type, text) {
    if (!element) {
      return;
    }

    element.className = `alert alert-${type}`;
    element.textContent = text;
    element.classList.remove('d-none');
  }

  function hideMessage(element) {
    if (!element) {
      return;
    }

    element.className = 'alert d-none';
    element.textContent = '';
  }

  function getStoredSettings() {
    try {
      return JSON.parse(global.localStorage.getItem(SETTINGS_STORAGE_KEY)) || null;
    } catch (error) {
      return null;
    }
  }

  function getStoredPayouts() {
    try {
      return JSON.parse(global.localStorage.getItem(PAYOUTS_STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveStoredSettings(settings) {
    global.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  function saveStoredPayouts(payouts) {
    global.localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(payouts));
  }

  function ensureOrganizerEvent(event) {
    const capacity = Number(event.capacity || Math.max(Number(event.availableTickets || 0), 100));
    const status = getEventStatus(event);

    return {
      ...event,
      capacity,
      availableTickets: Number(event.availableTickets || 0),
      price: Number(event.price || 0),
      status
    };
  }

  async function fetchEvents() {
    const response = await apiClient.get('/events');
    organizerEvents = response.data.map(ensureOrganizerEvent);
  }

  function getFilteredEvents() {
    const search = searchInput?.value.trim().toLowerCase() || '';
    const status = statusFilter?.value || 'Все статусы';

    return organizerEvents.filter((event) => {
      const matchesSearch = !search || [
        event.title,
        event.city,
        event.venue
      ].join(' ').toLowerCase().includes(search);
      const matchesStatus = status === 'Все статусы' || event.status === status;

      return matchesSearch && matchesStatus;
    });
  }

  function getStatusMarkup(status) {
    if (status === 'Опубликовано') {
      return '<span class="badge text-bg-success">Опубликовано</span>';
    }

    if (status === 'Черновик') {
      return '<span class="badge text-bg-secondary">Черновик</span>';
    }

    if (status === 'Приостановлено') {
      return '<span class="badge text-bg-warning">Приостановлено</span>';
    }

    return `<span class="badge bg-body-tertiary border">${status}</span>`;
  }

  function renderManageActions(event) {
    if (!managePauseButton || !manageUnpublishButton) {
      return;
    }

    const status = getEventStatus(event);

    if (status === 'Черновик') {
      managePauseButton.textContent = 'Продажи недоступны';
      managePauseButton.disabled = true;
      manageUnpublishButton.textContent = 'Опубликовать';
      manageUnpublishButton.classList.remove('btn-outline-danger');
      manageUnpublishButton.classList.add('btn-primary');
      return;
    }

    managePauseButton.disabled = false;
    managePauseButton.textContent = status === 'Приостановлено'
      ? 'Возобновить продажи'
      : 'Остановить продажи';
    manageUnpublishButton.textContent = 'Снять с публикации';
    manageUnpublishButton.classList.remove('btn-primary');
    manageUnpublishButton.classList.add('btn-outline-danger');
  }

  function createSalesMarkup(event) {
    const sold = Math.max(0, Number(event.capacity) - Number(event.availableTickets));
    const percent = event.capacity > 0
      ? Math.min(100, Math.round((sold / event.capacity) * 100))
      : 0;

    return `
      <div class="d-flex flex-column gap-1 organizer-sales-cell">
        <div class="d-flex justify-content-between align-items-center gap-3 small organizer-sales-meta">
          <span class="text-secondary organizer-sales-volume">${sold} / ${event.capacity}</span>
          <span class="text-secondary organizer-sales-percent">${percent}%</span>
        </div>
        <div class="progress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" style="height: 8px;">
          <div class="progress-bar" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  function createEventRow(event) {
    return `
      <tr>
        <td>
          <div class="fw-semibold">${event.title}</div>
          <div class="text-secondary small">${event.city} • ${event.venue}</div>
        </td>
        <td class="text-nowrap">${formatShortDate(event.date, event.time)}</td>
        <td class="text-nowrap">${createSalesMarkup(event)}</td>
        <td>${getStatusMarkup(event.status)}</td>
        <td class="text-end">
          <div class="btn-group">
            <a class="btn btn-sm btn-outline-secondary" href="event.html?id=${event.id}">Открыть</a>
            <button
              class="btn btn-sm btn-outline-secondary"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#manageModal"
              data-event-id="${event.id}"
              data-title="${event.title}"
            >
              Управление
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  function renderEventsTable() {
    const filteredEvents = getFilteredEvents();

    if (!filteredEvents.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-secondary py-4">События по текущим фильтрам не найдены.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredEvents.map(createEventRow).join('');
  }

  function renderSummary() {
    const activeEvents = organizerEvents.filter((event) => event.status === 'Опубликовано').length;
    const soldTickets = organizerEvents.reduce((total, event) => total + Math.max(0, event.capacity - event.availableTickets), 0);
    const pendingPayout = Math.round(soldTickets * 350);
    const requestedPayouts = getStoredPayouts().reduce((total, payout) => total + Number(payout.amount || 0), 0);
    const currentBalance = Math.max(0, pendingPayout - requestedPayouts);

    activeEventsValue.textContent = String(activeEvents);
    soldTicketsValue.textContent = String(soldTickets);
    refundsValue.textContent = '0';
    currentBalanceValue.textContent = formatCurrency(currentBalance);
    pendingPayoutValue.textContent = `Ожидает выплаты: ${formatCurrency(pendingPayout)}`;
    payoutAvailableAmount.textContent = formatCurrency(currentBalance);
    payoutAmountInput.value = String(currentBalance);
  }

  function fillSettingsForm() {
    const settings = getStoredSettings();

    if (!settings) {
      return;
    }

    organizerNameInput.value = settings.name || organizerNameInput.value;
    organizerEmailInput.value = settings.email || organizerEmailInput.value;
    organizerPhoneInput.value = settings.phone || organizerPhoneInput.value;
  }

  function resetCreateEventForm() {
    editingEventId = null;
    createEventForm.reset();
    createEventCategory.value = 'Концерт';
    createEventCapacity.value = '120';
    createEventPrice.value = '1200';
    createEventAge.value = '18+';
    createEventImage.value = '';
    if (createEventModalTitle) {
      createEventModalTitle.textContent = 'Создать событие';
    }
    if (createEventSaveButton) {
      createEventSaveButton.textContent = 'Сохранить';
    }
    hideMessage(createEventMessage);
  }

  function fillCreateEventForm(event) {
    editingEventId = String(event.id);
    createEventTitle.value = event.title;
    createEventCategory.value = event.category;
    createEventCity.value = event.city;
    createEventVenue.value = event.venue;
    createEventDate.value = event.date;
    createEventTime.value = event.time;
    createEventCapacity.value = String(event.capacity);
    createEventPrice.value = String(event.price);
    createEventAge.value = event.age || '18+';
    createEventDescription.value = event.description || '';
    createEventImage.value = event.image || '';

    if (createEventModalTitle) {
      createEventModalTitle.textContent = 'Редактировать событие';
    }
    if (createEventSaveButton) {
      createEventSaveButton.textContent = 'Сохранить изменения';
    }
    hideMessage(createEventMessage);
  }

  function getEventByIdLocal(eventId) {
    return organizerEvents.find((event) => String(event.id) === String(eventId)) || null;
  }

  async function persistEvent(eventId, eventData) {
    const response = eventId
      ? await apiClient.put(`/events/${eventId}`, eventData)
      : await apiClient.post('/events', eventData);

    return ensureOrganizerEvent(response.data);
  }

  async function updateEventState(eventId, patch) {
    const currentEvent = getEventByIdLocal(eventId);

    if (!currentEvent) {
      throw new Error('Event not found in organizer state.');
    }

    const updatedEvent = await apiClient.put(`/events/${eventId}`, {
      ...currentEvent,
      ...patch
    });

    const normalizedEvent = ensureOrganizerEvent(updatedEvent.data);
    organizerEvents = organizerEvents.map((event) => String(event.id) === String(eventId) ? normalizedEvent : event);
    return normalizedEvent;
  }

  function bindFilters() {
    [searchInput, statusFilter].forEach((control) => {
      control?.addEventListener(control === searchInput ? 'input' : 'change', renderEventsTable);
    });
  }

  async function handleSettingsSubmit(event) {
    event.preventDefault();

    organizerSettingsSaveButton.disabled = true;
    hideMessage(organizerSettingsMessage);

    const settings = {
      name: organizerNameInput.value.trim(),
      email: organizerEmailInput.value.trim(),
      phone: organizerPhoneInput.value.trim()
    };

    if (!settings.name || !settings.email || !settings.phone) {
      showMessage(organizerSettingsMessage, 'warning', 'Заполните все поля настроек.');
      organizerSettingsSaveButton.disabled = false;
      return;
    }

    saveStoredSettings(settings);
    showMessage(organizerSettingsMessage, 'success', 'Настройки организатора сохранены.');
    organizerSettingsSaveButton.disabled = false;
  }

  async function handleCreateEventSubmit(event) {
    event.preventDefault();

    hideMessage(createEventMessage);
    createEventSaveButton.disabled = true;

    const capacity = Number(createEventCapacity.value || 0);
    const price = Number(createEventPrice.value || 0);
    const eventPayload = {
      title: createEventTitle.value.trim(),
      description: createEventDescription.value.trim() || 'Описание события будет добавлено организатором позже.',
      date: createEventDate.value,
      time: createEventTime.value,
      city: createEventCity.value.trim(),
      venue: createEventVenue.value.trim(),
      price,
      image: createEventImage.value.trim() || 'https://placehold.co/800x500/1f2633/e6edf6?text=Событие',
      category: createEventCategory.value,
      availableTickets: capacity,
      capacity,
      age: createEventAge.value,
      status: editingEventId ? (getEventByIdLocal(editingEventId)?.status || 'Опубликовано') : 'Опубликовано'
    };

    if (!eventPayload.title || !eventPayload.city || !eventPayload.venue || !eventPayload.date || !eventPayload.time || capacity <= 0 || price < 0) {
      showMessage(createEventMessage, 'warning', 'Заполните обязательные поля события корректно.');
      createEventSaveButton.disabled = false;
      return;
    }

    try {
      const savedEvent = await persistEvent(editingEventId, {
        ...(editingEventId ? { id: editingEventId } : {}),
        ...eventPayload
      });

      if (editingEventId) {
        organizerEvents = organizerEvents.map((eventItem) => String(eventItem.id) === String(editingEventId) ? savedEvent : eventItem);
      } else {
        organizerEvents = [...organizerEvents, savedEvent];
      }

      renderSummary();
      renderEventsTable();
      showMessage(createEventMessage, 'success', editingEventId ? 'Событие обновлено.' : 'Событие создано.');

      global.setTimeout(() => {
        const modalInstance = global.bootstrap?.Modal.getOrCreateInstance(createEventModalElement);
        modalInstance?.hide();
      }, 600);
    } catch (error) {
      console.error('Organizer event save failed.', error);
      showMessage(createEventMessage, 'danger', 'Не удалось сохранить событие. Попробуйте позже.');
    } finally {
      createEventSaveButton.disabled = false;
    }
  }

  function handleManageModalShow(event) {
    const triggerButton = event.relatedTarget;
    const eventId = triggerButton?.getAttribute('data-event-id');
    const currentEvent = getEventByIdLocal(eventId);
    const eventTitle = currentEvent?.title || triggerButton?.getAttribute('data-title') || '—';

    activeManageEventId = eventId;
    manageEventTitle.textContent = eventTitle;
    hideMessage(manageEventMessage);
    renderManageActions(currentEvent);
  }

  function openCreateEventModalForEdit() {
    const currentEvent = getEventByIdLocal(activeManageEventId);

    if (!currentEvent) {
      showMessage(manageEventMessage, 'danger', 'Не удалось найти событие для редактирования.');
      return;
    }

    fillCreateEventForm(currentEvent);
    global.bootstrap?.Modal.getOrCreateInstance(manageModalElement)?.hide();
    global.setTimeout(() => {
      global.bootstrap?.Modal.getOrCreateInstance(createEventModalElement)?.show();
    }, 200);
  }

  function showSalesInfo() {
    const currentEvent = getEventByIdLocal(activeManageEventId);

    if (!currentEvent) {
      showMessage(manageEventMessage, 'danger', 'Не удалось загрузить данные продаж.');
      return;
    }

    const sold = Math.max(0, currentEvent.capacity - currentEvent.availableTickets);
    const revenue = sold * currentEvent.price;
    showMessage(manageEventMessage, 'info', `Продано ${sold} из ${currentEvent.capacity} билетов. Выручка: ${formatCurrency(revenue)}.`);
  }

  async function toggleSales() {
    const currentEvent = getEventByIdLocal(activeManageEventId);

    if (!currentEvent) {
      showMessage(manageEventMessage, 'danger', 'Не удалось изменить статус продаж.');
      return;
    }

    if (getEventStatus(currentEvent) === 'Черновик') {
      showMessage(manageEventMessage, 'warning', 'Сначала опубликуйте событие, чтобы управлять продажами.');
      renderManageActions(currentEvent);
      return;
    }

    try {
      const nextStatus = currentEvent.status === 'Приостановлено' ? 'Опубликовано' : 'Приостановлено';
      const updatedEvent = await updateEventState(activeManageEventId, { status: nextStatus });
      renderSummary();
      renderEventsTable();
      renderManageActions(updatedEvent);
      showMessage(manageEventMessage, 'success', updatedEvent.status === 'Приостановлено' ? 'Продажи остановлены.' : 'Продажи снова активны.');
    } catch (error) {
      console.error('Organizer sales toggle failed.', error);
      showMessage(manageEventMessage, 'danger', 'Не удалось изменить статус продаж.');
    }
  }

  async function unpublishEvent() {
    const currentEvent = getEventByIdLocal(activeManageEventId);

    if (!currentEvent) {
      showMessage(manageEventMessage, 'danger', 'Не удалось изменить публикацию события.');
      return;
    }

    try {
      const nextStatus = getEventStatus(currentEvent) === 'Черновик' ? 'Опубликовано' : 'Черновик';
      const updatedEvent = await updateEventState(activeManageEventId, { status: nextStatus });
      renderSummary();
      renderEventsTable();
      renderManageActions(updatedEvent);
      showMessage(
        manageEventMessage,
        'success',
        updatedEvent.status === 'Черновик'
          ? 'Событие снято с публикации и переведено в черновик.'
          : 'Событие снова опубликовано и доступно пользователям.'
      );
    } catch (error) {
      console.error('Organizer unpublish failed.', error);
      showMessage(manageEventMessage, 'danger', 'Не удалось снять событие с публикации.');
    }
  }

  function handlePayoutSubmit() {
    hideMessage(payoutMessage);

    const amount = Number(payoutAmountInput.value || 0);
    const account = payoutAccountInput.value.trim();

    if (amount <= 0 || !account) {
      showMessage(payoutMessage, 'warning', 'Укажите сумму и счёт для выплаты.');
      return;
    }

    const payouts = getStoredPayouts();
    payouts.push({
      id: Date.now(),
      amount,
      account,
      createdAt: new Date().toISOString()
    });
    saveStoredPayouts(payouts);
    renderSummary();
    showMessage(payoutMessage, 'success', 'Запрос на выплату отправлен.');
  }

  async function initOrganizerPage() {
    if (!isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    fillSettingsForm();
    bindFilters();

    try {
      await fetchEvents();
      renderSummary();
      renderEventsTable();
    } catch (error) {
      console.error('Organizer page loading failed.', error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-danger py-4">Не удалось загрузить события организатора.</td>
        </tr>
      `;
    }
  }

  settingsForm.addEventListener('submit', handleSettingsSubmit);
  createEventForm.addEventListener('submit', handleCreateEventSubmit);
  createEventModalElement?.addEventListener('hidden.bs.modal', resetCreateEventForm);
  manageModalElement?.addEventListener('show.bs.modal', handleManageModalShow);
  manageEditButton?.addEventListener('click', openCreateEventModalForEdit);
  manageSalesButton?.addEventListener('click', showSalesInfo);
  managePauseButton?.addEventListener('click', toggleSales);
  manageUnpublishButton?.addEventListener('click', unpublishEvent);
  payoutSubmitButton?.addEventListener('click', handlePayoutSubmit);
  payoutModalElement?.addEventListener('show.bs.modal', () => hideMessage(payoutMessage));

  initOrganizerPage();
})(window);
