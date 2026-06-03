(function (global) {
  const pageContainer = document.getElementById('eventDetailsPage');
  const reviewModalElement = document.getElementById('reviewModal');
  const reviewForm = document.getElementById('reviewForm');
  const reviewRatingInput = document.getElementById('reviewRating');
  const reviewTextInput = document.getElementById('reviewText');
  const reviewMessage = document.getElementById('reviewMessage');
  const reviewSubmitButton = document.getElementById('reviewSubmitButton');

  if (!pageContainer || !global.KontramarkaEventsService) {
    return;
  }

  const { getEventById } = global.KontramarkaEventsService;
  const authService = global.KontramarkaAuth;
  const favoritesService = global.KontramarkaFavoritesService;
  const reviewsService = global.KontramarkaReviewsService;
  let currentEvent = null;
  let currentReviews = [];
  let currentFavorite = null;
  let pageMessage = null;
  let pageMessageTimeoutId = null;
  let isReviewSubmitting = false;

  function getEventIdFromQuery() {
    const params = new URLSearchParams(global.location.search);
    const rawId = params.get('id');
    const eventId = Number(rawId);

    if (!rawId || !Number.isInteger(eventId) || eventId <= 0) {
      return null;
    }

    return eventId;
  }

  function formatEventDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }

  function formatReviewDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Недавно';
    }

    return parsedDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getEventStatus(event) {
    return event?.status || 'Опубликовано';
  }

  function isPublishedEvent(event) {
    return getEventStatus(event) === 'Опубликовано';
  }

  function isEventPurchasable(event) {
    return isPublishedEvent(event) && Number(event?.availableTickets || 0) > 0;
  }

  function getStatusInfo(event) {
    const status = getEventStatus(event);

    if (status === 'Приостановлено') {
      return {
        badgeClass: 'text-bg-warning',
        badgeText: 'Продажи приостановлены',
        message: 'Продажа билетов временно приостановлена организатором.'
      };
    }

    if (status === 'Черновик') {
      return {
        badgeClass: 'text-bg-secondary',
        badgeText: 'Снято с публикации',
        message: 'Это мероприятие снято с публикации и временно недоступно для покупки.'
      };
    }

    return {
      badgeClass: 'bg-body-tertiary border',
      badgeText: Number(event?.availableTickets || 0) > 0
        ? `Доступно: ${event.availableTickets}`
        : 'Билеты закончились',
      message: ''
    };
  }

  function renderState(title, message, stateClass) {
    pageContainer.innerHTML = `
      <div class="border rounded-4 p-4 p-lg-5 text-center ${stateClass}">
        <h1 class="h4 fw-semibold mb-2">${title}</h1>
        <p class="mb-0">${message}</p>
      </div>
    `;
  }

  function getAvailabilityMarkup(event) {
    const statusInfo = getStatusInfo(event);

    if (!isPublishedEvent(event)) {
      return `<span class="badge ${statusInfo.badgeClass}" id="eventAvailableTicketsBadge">${statusInfo.badgeText}</span>`;
    }

    if (event.availableTickets <= 0) {
      return '<span class="badge text-bg-danger" id="eventAvailableTicketsBadge">Билеты закончились</span>';
    }

    return `<span class="badge bg-body-tertiary border" id="eventAvailableTicketsBadge">Доступно: ${event.availableTickets}</span>`;
  }

  function getLoginRedirectUrl() {
    const returnUrl = `${global.location.pathname.split('/').pop()}${global.location.search}`;
    return `login.html?redirect=${encodeURIComponent(returnUrl)}`;
  }

  function renderMessage() {
    if (!pageMessage) {
      return '';
    }

    return `
      <div class="alert alert-${pageMessage.type} mb-4" role="alert">
        ${pageMessage.text}
      </div>
    `;
  }

  function setPageMessage(type, text) {
    if (pageMessageTimeoutId) {
      global.clearTimeout(pageMessageTimeoutId);
      pageMessageTimeoutId = null;
    }

    if (!type || !text) {
      pageMessage = null;
      return;
    }

    pageMessage = { type, text };
  }

  function scheduleMessageClear(delay = 2800) {
    if (pageMessageTimeoutId) {
      global.clearTimeout(pageMessageTimeoutId);
    }

    pageMessageTimeoutId = global.setTimeout(() => {
      pageMessage = null;
      pageMessageTimeoutId = null;

      if (currentEvent) {
        renderEvent(currentEvent);
      }
    }, delay);
  }

  function getBuyButtonAttributes(event) {
    if (!isEventPurchasable(event)) {
      return 'class="btn btn-secondary" type="button" disabled';
    }

    return `class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#buyModal" data-buy="e${event.id}" data-event-id="${event.id}" data-title="${event.title}" data-price="${event.price}" data-available-tickets="${event.availableTickets}"`;
  }

  function getFavoriteButtonMarkup() {
    const isAuthenticated = authService?.isAuthenticated();
    const isFavorite = Boolean(currentFavorite);

    return `
      <button
        class="btn ${isFavorite ? 'btn-primary' : 'btn-outline-secondary'}"
        type="button"
        id="favoriteToggleButton"
        ${!isAuthenticated ? 'title="Для добавления в избранное нужно войти"' : ''}
      >
        ${isFavorite ? '★ В избранном' : '☆ В избранное'}
      </button>
    `;
  }

  function getReviewsMarkup() {
    if (!currentReviews.length) {
      return `
        <div class="text-secondary">
          Пока нет отзывов. Вы можете стать первым, кто поделится впечатлением.
        </div>
      `;
    }

    return currentReviews.map((review, index) => `
      <div class="d-flex gap-3">
        <div class="rounded-circle bg-body-tertiary border d-flex align-items-center justify-content-center fw-semibold" style="width:40px;height:40px;">
          ${review.userName ? review.userName.trim().charAt(0).toUpperCase() : 'К'}
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div class="fw-semibold">${review.userName || 'Пользователь Контрамарки'}</div>
            <div class="text-secondary small">${formatReviewDate(review.createdAt)}</div>
          </div>
          <div class="text-warning small">${'★'.repeat(Number(review.rating || 0))}${'☆'.repeat(5 - Number(review.rating || 0))}</div>
          <div class="text-secondary mt-1">
            ${review.text}
          </div>
        </div>
      </div>
      ${index < currentReviews.length - 1 ? '<hr>' : ''}
    `).join('');
  }

  function renderEvent(event) {
    const status = getEventStatus(event);
    const isSoldOut = Number(event.availableTickets) <= 0;
    const isPurchasable = isEventPurchasable(event);
    const statusInfo = getStatusInfo(event);
    const buyButtonText = !isPublishedEvent(event)
      ? (status === 'Приостановлено' ? 'Продажи приостановлены' : 'Недоступно')
      : (isSoldOut ? 'Билеты закончились' : 'Купить билет');
    const buyButtonAttributes = getBuyButtonAttributes(event);

    document.title = `Контрамарка — ${event.title}`;

    pageContainer.innerHTML = `
      ${renderMessage()}
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-3">
          <li class="breadcrumb-item"><a href="index.html">События</a></li>
          <li class="breadcrumb-item active" aria-current="page">${event.title}</li>
        </ol>
      </nav>

      <div class="row g-4 align-items-start">
        <div class="col-lg-7">
          <div class="border rounded-4 p-3 p-lg-4">
            <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
              <span class="badge bg-body-tertiary border">${event.category}</span>
              ${getAvailabilityMarkup(event)}
            </div>

            <h1 class="h3 fw-semibold mb-2">${event.title}</h1>
            <div class="text-secondary mb-3">${event.city} • ${formatEventDate(event.date)} • ${event.time}</div>

            <p class="mb-0 text-secondary">
              ${event.description}
            </p>

            ${!isPublishedEvent(event) ? `
              <div class="alert alert-warning mt-3 mb-0" role="alert">
                ${statusInfo.message}
              </div>
            ` : ''}

            <hr>

            <div class="d-flex flex-column flex-sm-row gap-2">
              <button ${buyButtonAttributes}>
                <span class="icon-text">
                  <svg class="icon" aria-hidden="true">
                    <use href="assets/icons/sprite.svg#icon-ticket"></use>
                  </svg>
                  <span>${buyButtonText}</span>
                </span>
              </button>
              <button class="btn btn-outline-secondary" type="button" data-bs-toggle="modal" data-bs-target="#shareModal">
                Поделиться
              </button>
              ${getFavoriteButtonMarkup()}
            </div>
          </div>

          <div class="border rounded-4 p-3 p-lg-4 mt-4">
            <div class="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
              <h2 class="h6 mb-0">Отзывы</h2>
              <button class="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#reviewModal">
                Оставить отзыв
              </button>
            </div>

            ${getReviewsMarkup()}
          </div>
        </div>

        <div class="col-lg-5">
          <div class="border rounded-4 p-3 p-lg-4">
            <h2 class="h6 mb-3">Место проведения</h2>

            <div class="fw-semibold">${event.venue}</div>
            <div class="text-secondary">${event.city}</div>

            <div class="mt-3 border rounded-4 overflow-hidden bg-body-tertiary">
              <img
                src="${event.image}"
                alt="${event.title}"
                class="w-100"
                style="height: 220px; object-fit: cover;"
              >
            </div>

            <hr>

            <h3 class="h6 mb-2">Информация</h3>
            <div class="border rounded-4 p-3 bg-body-tertiary">
              <div class="d-flex justify-content-between small">
                <span class="text-secondary">Дата</span>
                <span>${formatEventDate(event.date)}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Время</span>
                <span>${event.time}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Категория</span>
                <span>${event.category}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Билеты</span>
                <span id="eventAvailableTicketsValue">${event.availableTickets > 0 ? `${event.availableTickets} шт.` : 'Нет в наличии'}</span>
              </div>
            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="text-secondary small">Цена</div>
                <div class="h5 mb-0 fw-semibold">от ${event.price.toLocaleString('ru-RU')} ₽</div>
              </div>
              <button ${buyButtonAttributes}>
                <span class="icon-text">
                  <svg class="icon" aria-hidden="true">
                    <use href="assets/icons/sprite.svg#icon-ticket"></use>
                  </svg>
                  <span>${!isPurchasable ? buyButtonText : 'Купить'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const shareEventLink = document.getElementById('shareEventLink');

    if (shareEventLink) {
      shareEventLink.value = global.location.href;
    }
  }

  function applyPurchaseResult(updatedEvent) {
    if (!updatedEvent || !currentEvent || String(updatedEvent.id) !== String(currentEvent.id)) {
      return;
    }

    currentEvent = {
      ...currentEvent,
      ...updatedEvent,
      availableTickets: Number(updatedEvent.availableTickets)
    };

    setPageMessage('success', `Заказ успешно оформлен. Осталось билетов: ${currentEvent.availableTickets}.`);
    renderEvent(currentEvent);
    updatePurchaseUi(currentEvent);
    scheduleMessageClear(7000);
  }

  function updatePurchaseUi(event) {
    const badge = document.getElementById('eventAvailableTicketsBadge');
    const value = document.getElementById('eventAvailableTicketsValue');
    const buyButtons = pageContainer.querySelectorAll('[data-event-id]');
    const isSoldOut = Number(event.availableTickets) <= 0;
    const status = getEventStatus(event);
    const isPurchasable = isEventPurchasable(event);

    if (badge) {
      if (status === 'Приостановлено') {
        badge.className = 'badge text-bg-warning';
        badge.textContent = 'Продажи приостановлены';
      } else if (status === 'Черновик') {
        badge.className = 'badge text-bg-secondary';
        badge.textContent = 'Снято с публикации';
      } else if (isSoldOut) {
        badge.className = 'badge text-bg-danger';
        badge.textContent = 'Билеты закончились';
      } else {
        badge.className = 'badge bg-body-tertiary border';
        badge.textContent = `Доступно: ${event.availableTickets}`;
      }
    }

    if (value) {
      value.textContent = isSoldOut ? 'Нет в наличии' : `${event.availableTickets} шт.`;
    }

    buyButtons.forEach((button) => {
      button.setAttribute('data-available-tickets', String(event.availableTickets));

      if (!isPurchasable) {
        button.disabled = true;
        button.textContent = status === 'Приостановлено'
          ? 'Продажи приостановлены'
          : (status === 'Черновик'
            ? 'Недоступно'
            : (button.textContent.includes('Купить билет') ? 'Билеты закончились' : 'Нет билетов'));
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
        button.removeAttribute('data-bs-toggle');
        button.removeAttribute('data-bs-target');
      } else {
        button.disabled = false;
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#buyModal');
      }
    });
  }

  function hideReviewMessage() {
    if (!reviewMessage) {
      return;
    }

    reviewMessage.className = 'alert d-none mt-3 mb-0';
    reviewMessage.textContent = '';
  }

  function showReviewMessage(type, text) {
    if (!reviewMessage) {
      return;
    }

    reviewMessage.className = `alert alert-${type} mt-3 mb-0`;
    reviewMessage.textContent = text;
  }

  function setReviewSubmittingState(submitting) {
    isReviewSubmitting = submitting;

    if (!reviewSubmitButton) {
      return;
    }

    reviewSubmitButton.disabled = submitting;
    reviewSubmitButton.textContent = submitting ? 'Публикуем...' : 'Опубликовать';
  }

  async function loadEventRelatedData(eventId) {
    const currentUser = authService?.getCurrentUser();
    const promises = [
      getEventById(eventId),
      reviewsService ? reviewsService.getReviewsByEvent(eventId) : Promise.resolve([])
    ];

    if (currentUser && favoritesService) {
      promises.push(favoritesService.getFavoriteByUserAndEvent(currentUser.id, eventId));
    } else {
      promises.push(Promise.resolve(null));
    }

    const [event, reviews, favorite] = await Promise.all(promises);
    currentEvent = event;
    currentReviews = Array.isArray(reviews) ? reviews : [];
    currentFavorite = favorite;
  }

  async function handleFavoriteToggle() {
    if (!currentEvent || !favoritesService || !authService) {
      return;
    }

    if (!authService.isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    const currentUser = authService.getCurrentUser();

    try {
      if (currentFavorite) {
        await favoritesService.removeFavorite(currentFavorite.id);
        currentFavorite = null;
        setPageMessage('info', 'Мероприятие удалено из избранного.');
      } else {
        currentFavorite = await favoritesService.addFavorite({
          userId: currentUser.id,
          eventId: currentEvent.id
        });
        setPageMessage('success', 'Мероприятие добавлено в избранное.');
      }

      renderEvent(currentEvent);
      scheduleMessageClear(6000);
    } catch (error) {
      console.error('Favorite toggle failed.', error);
      setPageMessage('danger', 'Не удалось обновить избранное. Попробуйте позже.');
      renderEvent(currentEvent);
      scheduleMessageClear(6000);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!currentEvent || !reviewsService || !authService || isReviewSubmitting) {
      return;
    }

    if (!authService.isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    const text = reviewTextInput?.value.trim() || '';
    const rating = Number(reviewRatingInput?.value || 5);

    if (text.length < 10) {
      showReviewMessage('warning', 'Напишите отзыв чуть подробнее: минимум 10 символов.');
      return;
    }

    const currentUser = authService.getCurrentUser();
    setReviewSubmittingState(true);
    hideReviewMessage();

    try {
      const review = await reviewsService.createReview({
        eventId: currentEvent.id,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        text
      });

      currentReviews = await reviewsService.getReviewsByEvent(currentEvent.id);
      setPageMessage('success', 'Отзыв успешно опубликован.');
      renderEvent(currentEvent);
      scheduleMessageClear(6000);

      if (reviewForm) {
        reviewForm.reset();
      }

      if (reviewRatingInput) {
        reviewRatingInput.value = '5';
      }

      const modalInstance = global.bootstrap?.Modal.getOrCreateInstance(reviewModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error('Review creation failed.', error);
      showReviewMessage('danger', 'Не удалось опубликовать отзыв. Попробуйте позже.');
    } finally {
      setReviewSubmittingState(false);
    }
  }

  document.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('#favoriteToggleButton');

    if (favoriteButton) {
      handleFavoriteToggle();
    }
  });

  document.addEventListener('kontramarka:ticket-purchased', async (event) => {
    if (!currentEvent || String(event.detail.eventId) !== String(currentEvent.id)) {
      return;
    }

    try {
      const updatedEvent = await getEventById(currentEvent.id);
      applyPurchaseResult(updatedEvent);
      return;
    } catch (error) {
      applyPurchaseResult({
        ...currentEvent,
        availableTickets: event.detail.availableTickets
      });
      return;
    }
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewSubmit);
  }

  if (reviewModalElement) {
    reviewModalElement.addEventListener('show.bs.modal', () => {
      if (!authService?.isAuthenticated()) {
        global.location.href = getLoginRedirectUrl();
        return;
      }

      hideReviewMessage();
    });

    reviewModalElement.addEventListener('hidden.bs.modal', () => {
      hideReviewMessage();
      setReviewSubmittingState(false);
      if (reviewForm) {
        reviewForm.reset();
      }
      if (reviewRatingInput) {
        reviewRatingInput.value = '5';
      }
    });
  }

  async function initEventPage() {
    renderState('Загрузка мероприятия...', 'Получаем данные события из mock API.', 'text-secondary');

    const eventId = getEventIdFromQuery();

    if (!eventId) {
      renderState('Некорректная ссылка', 'Не удалось открыть мероприятие по этой ссылке.', 'text-danger');
      return;
    }

    try {
      await loadEventRelatedData(eventId);
      renderEvent(currentEvent);
    } catch (error) {
      console.error('Event loading failed.', error);

      if (error.response && error.response.status === 404) {
        renderState('Мероприятие не найдено', 'Событие не найдено или было удалено.', 'text-warning');
        return;
      }

      renderState('Ошибка загрузки', 'Не удалось загрузить данные мероприятия. Попробуйте позже.', 'text-danger');
    }
  }

  global.KontramarkaEventPage = {
    applyPurchaseResult
  };

  initEventPage();
})(window);
