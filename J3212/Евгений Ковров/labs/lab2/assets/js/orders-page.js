(function (global) {
  const pageContent = document.getElementById('ordersPageContent');

  if (
    !pageContent ||
    !global.KontramarkaAuth ||
    !global.KontramarkaOrdersService ||
    !global.KontramarkaEventsService ||
    !global.KontramarkaFavoritesService
  ) {
    return;
  }

  const { getCurrentUser, isAuthenticated } = global.KontramarkaAuth;
  const { getOrdersByUser } = global.KontramarkaOrdersService;
  const { getEventById } = global.KontramarkaEventsService;
  const { getFavoritesByUser } = global.KontramarkaFavoritesService;
  const DEFAULT_VISIBLE_ORDERS_COUNT = 3;
  let currentOrdersWithEvents = [];
  let currentFavoritesWithEvents = [];
  let isOrdersExpanded = false;

  function getLoginRedirectUrl() {
    return `login.html?redirect=${encodeURIComponent('orders.html')}`;
  }

  function formatDateTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  function renderState(title, message, stateClass) {
    pageContent.innerHTML = `
      <div class="border rounded-4 p-4 p-lg-5 text-center ${stateClass}">
        <h2 class="h5 fw-semibold mb-2">${title}</h2>
        <p class="mb-0">${message}</p>
      </div>
    `;
  }

  function getStatusMarkup(status) {
    if (status === 'confirmed') {
      return '<span class="badge text-bg-success">Подтверждён</span>';
    }

    if (status === 'cancelled') {
      return '<span class="badge text-bg-secondary">Отменён</span>';
    }

    return `<span class="badge bg-body-tertiary border">${status}</span>`;
  }

  function createOrderCard(orderWithEvent) {
    const { order, event } = orderWithEvent;
    const eventInfo = event
      ? `
        <div class="fw-semibold">${event.title}</div>
        <div class="text-secondary small">${event.city} • ${event.venue}</div>
        <div class="text-secondary small mt-1">${formatEventDate(event.date)} • ${event.time}</div>
      `
      : `
        <div class="fw-semibold">Информация о мероприятии недоступна</div>
        <div class="text-secondary small">Данные о событии не удалось загрузить.</div>
      `;

    return `
      <div class="border rounded-4 p-3 p-lg-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
          <div>
            ${eventInfo}
          </div>
          <div class="text-lg-end">
            ${getStatusMarkup(order.status)}
            <div class="text-secondary small mt-2">Заказ от ${formatDateTime(order.createdAt)}</div>
          </div>
        </div>

        <hr>

        <div class="row g-3 small">
          <div class="col-sm-4">
            <div class="text-secondary">Количество билетов</div>
            <div class="fw-semibold">${order.quantity}</div>
          </div>
          <div class="col-sm-4">
            <div class="text-secondary">Сумма</div>
            <div class="fw-semibold">${order.totalPrice.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div class="col-sm-4">
            <div class="text-secondary">Номер заказа</div>
            <div class="fw-semibold">#${order.id}</div>
          </div>
        </div>
      </div>
    `;
  }

  function createFavoriteCard(favoriteWithEvent) {
    const { favorite, event } = favoriteWithEvent;

    if (!event) {
      return `
        <div class="border rounded-4 p-3 p-lg-4">
          <div class="fw-semibold">Информация о мероприятии недоступна</div>
          <div class="text-secondary small mt-1">Событие было удалено или временно недоступно.</div>
          <div class="text-secondary small mt-3">Добавлено в избранное: ${formatDateTime(favorite.createdAt)}</div>
        </div>
      `;
    }

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
                <div class="text-secondary small">${event.city} • ${event.venue}</div>
                <div class="text-secondary small mt-1">${formatEventDate(event.date)} • ${event.time}</div>
              </div>
              <span class="badge bg-body-tertiary border">${event.category}</span>
            </div>
          </div>
          <div class="card-footer bg-transparent border-top-0 pt-0 pb-3">
            <div class="d-flex justify-content-between align-items-center gap-3">
              <div>
                <div class="fw-semibold">от ${event.price.toLocaleString('ru-RU')} ₽</div>
                <div class="text-secondary small">Добавлено: ${formatDateTime(favorite.createdAt)}</div>
              </div>
              <a class="btn btn-sm btn-outline-secondary" href="event.html?id=${event.id}">Открыть</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSection(title, subtitle, content) {
    return `
      <section class="mb-4">
        <div class="mb-3">
          <h2 class="h5 fw-semibold mb-1">${title}</h2>
          <div class="text-secondary">${subtitle}</div>
        </div>
        ${content}
      </section>
    `;
  }

  function renderEmptySection(message) {
    return `
      <div class="border rounded-4 p-4 text-center text-secondary">
        ${message}
      </div>
    `;
  }

  function sortOrdersByNewest(ordersWithEvents) {
    return [...ordersWithEvents].sort((left, right) => {
      const leftDate = new Date(left.order.createdAt).getTime();
      const rightDate = new Date(right.order.createdAt).getTime();
      return rightDate - leftDate;
    });
  }

  function getOrdersToggleButton(totalCount) {
    if (totalCount <= DEFAULT_VISIBLE_ORDERS_COUNT) {
      return '';
    }

    return `
      <div class="text-center mt-3">
        <button class="btn btn-outline-secondary" type="button" id="ordersToggleButton">
          ${isOrdersExpanded ? 'Свернуть список ▲' : 'Показать все заказы ▼'}
        </button>
      </div>
    `;
  }

  function createOrdersContent(ordersWithEvents) {
    if (!ordersWithEvents.length) {
      return renderEmptySection('Пока нет заказов. После покупки билетов они появятся в этом разделе.');
    }

    const visibleOrders = isOrdersExpanded
      ? ordersWithEvents
      : ordersWithEvents.slice(0, DEFAULT_VISIBLE_ORDERS_COUNT);

    return `
      <div class="d-grid gap-3">${visibleOrders.map(createOrderCard).join('')}</div>
      ${getOrdersToggleButton(ordersWithEvents.length)}
    `;
  }

  function renderOrdersAndFavorites() {
    const ordersContent = currentOrdersWithEvents.length
      ? createOrdersContent(currentOrdersWithEvents)
      : renderEmptySection('Пока нет заказов. После покупки билетов они появятся в этом разделе.');

    const favoritesContent = currentFavoritesWithEvents.length
      ? `<div class="row row-cols-1 row-cols-md-2 g-3">${currentFavoritesWithEvents.map(createFavoriteCard).join('')}</div>`
      : renderEmptySection('В избранном пока пусто. Добавляйте интересные события со страницы мероприятия.');

    pageContent.innerHTML = `
      ${renderSection('Заказы', 'Ваши покупки и статусы заказов.', ordersContent)}
      ${renderSection('Избранное', 'События, которые вы сохранили на потом.', favoritesContent)}
    `;
  }

  async function loadOrderEvent(order) {
    try {
      const event = await getEventById(order.eventId);
      return { order, event };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { order, event: null };
      }

      throw error;
    }
  }

  async function loadFavoriteEvent(favorite) {
    try {
      const event = await getEventById(favorite.eventId);
      return { favorite, event };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { favorite, event: null };
      }

      throw error;
    }
  }

  async function initOrdersPage() {
    if (!isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    renderState('Загрузка данных...', 'Получаем ваши заказы и избранные мероприятия.', 'text-secondary');

    try {
      const currentUser = getCurrentUser();
      const [orders, favorites] = await Promise.all([
        getOrdersByUser(currentUser.id),
        getFavoritesByUser(currentUser.id)
      ]);

      const [ordersWithEvents, favoritesWithEvents] = await Promise.all([
        Promise.all(orders.map(loadOrderEvent)),
        Promise.all(favorites.map(loadFavoriteEvent))
      ]);

      currentOrdersWithEvents = sortOrdersByNewest(ordersWithEvents);
      currentFavoritesWithEvents = favoritesWithEvents;
      renderOrdersAndFavorites();
    } catch (error) {
      console.error('Orders page loading failed.', error);
      renderState('Ошибка загрузки', 'Не удалось загрузить ваши данные. Попробуйте позже.', 'text-danger');
    }
  }

  document.addEventListener('click', (event) => {
    const toggleButton = event.target.closest('#ordersToggleButton');

    if (!toggleButton) {
      return;
    }

    isOrdersExpanded = !isOrdersExpanded;
    renderOrdersAndFavorites();
  });

  initOrdersPage();
})(window);
