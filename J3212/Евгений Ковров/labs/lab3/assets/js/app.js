(function () {
  const buyModalElement = document.getElementById('buyModal');
  const buyEventName = document.getElementById('buyEventName');
  const buyEventMeta = document.getElementById('buyEventMeta');
  const buyQuantitySelect = document.getElementById('buyQuantitySelect');
  const buyModalHint = document.getElementById('buyModalHint');
  const buyModalMessage = document.getElementById('buyModalMessage');
  const buyConfirmButton = document.getElementById('buyConfirmButton');
  const purchaseToastElement = document.getElementById('purchaseToast');
  const purchaseToastBody = document.getElementById('purchaseToastBody');
  const ordersService = window.KontramarkaOrdersService;
  const eventsService = window.KontramarkaEventsService;
  const authService = window.KontramarkaAuth;
  let activeBuyState = null;
  let isSubmitting = false;
  let pendingToastMessage = '';
  let toastHideTimeoutId = null;
  let lastBuyTriggerButton = null;

  function delay(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function hideBuyMessage() {
    if (!buyModalMessage) {
      return;
    }

    buyModalMessage.className = 'alert d-none mt-3 mb-0';
    buyModalMessage.textContent = '';
  }

  function showBuyMessage(type, message) {
    if (!buyModalMessage) {
      return;
    }

    buyModalMessage.className = `alert alert-${type} mt-3 mb-0`;
    buyModalMessage.textContent = message;
  }

  function showPurchaseToast(message) {
    if (!purchaseToastElement || !purchaseToastBody) {
      return;
    }

    purchaseToastBody.textContent = message;
    purchaseToastElement.style.display = 'block';
    purchaseToastElement.classList.add('show');
    purchaseToastElement.classList.remove('hide');

    if (toastHideTimeoutId) {
      window.clearTimeout(toastHideTimeoutId);
    }

    toastHideTimeoutId = window.setTimeout(() => {
      purchaseToastElement.classList.remove('show');
      purchaseToastElement.classList.add('hide');
      purchaseToastElement.style.display = 'none';
      toastHideTimeoutId = null;
    }, 5000);
  }

  function updateEventPageAvailability(availableTickets) {
    const badge = document.getElementById('eventAvailableTicketsBadge');
    const value = document.getElementById('eventAvailableTicketsValue');

    if (badge) {
      if (Number(availableTickets) > 0) {
        badge.className = 'badge bg-body-tertiary border';
        badge.textContent = `Доступно: ${availableTickets}`;
      } else {
        badge.className = 'badge text-bg-danger';
        badge.textContent = 'Билеты закончились';
      }
    }

    if (value) {
      value.textContent = Number(availableTickets) > 0 ? `${availableTickets} шт.` : 'Нет в наличии';
    }
  }

  function setBuySubmittingState(submitting, buttonText) {
    isSubmitting = submitting;

    if (!buyConfirmButton) {
      return;
    }

    buyConfirmButton.disabled = submitting;
    buyConfirmButton.textContent = buttonText;
  }

  function updateQuantityOptions(availableTickets) {
    if (!buyQuantitySelect) {
      return;
    }

    const available = Number(availableTickets || 0);
    const maxTickets = Math.max(1, Math.min(available, 4));

    buyQuantitySelect.innerHTML = Array.from({ length: maxTickets }, (_, index) => {
      const value = index + 1;
      return `<option value="${value}"${value === 1 ? ' selected' : ''}>${value}</option>`;
    }).join('');
    buyQuantitySelect.disabled = available <= 0;
  }

  function syncBuyButtons(eventId, availableTickets) {
    document.querySelectorAll(`[data-event-id="${eventId}"]`).forEach((button) => {
      button.setAttribute('data-available-tickets', String(availableTickets));

      if (Number(availableTickets) <= 0) {
        button.disabled = true;
        button.textContent = 'Билеты закончились';
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
      }
    });
  }

  function getBuyStateFromButton(button) {
    if (!button) {
      return null;
    }

    return {
      eventId: String(button.getAttribute('data-event-id') || ''),
      title: button.getAttribute('data-title') || 'Мероприятие',
      price: Number(button.getAttribute('data-price') || 0),
      availableTickets: Number(button.getAttribute('data-available-tickets') || 0)
    };
  }

  function getEventStatus(event) {
    return event?.status || 'Опубликовано';
  }

  function isEventPurchasable(event) {
    return getEventStatus(event) === 'Опубликовано' && Number(event?.availableTickets || 0) > 0;
  }

  function hasValidBuyState(state) {
    return Boolean(
      state &&
      state.eventId &&
      state.title &&
      Number.isFinite(state.price) &&
      Number.isFinite(state.availableTickets)
    );
  }

  function setActiveBuyStateFromButton(button, source) {
    const state = getBuyStateFromButton(button);

    if (!hasValidBuyState(state)) {
      console.error(`Buy modal state is invalid from ${source}.`, {
        button,
        state
      });
      showBuyMessage('danger', 'Не удалось подготовить данные для покупки. Попробуйте открыть окно ещё раз.');
      return false;
    }

    lastBuyTriggerButton = button;
    activeBuyState = state;
    renderBuyModal(activeBuyState);
    return true;
  }

  function renderBuyModal(state) {
    if (!buyEventName || !buyEventMeta || !buyModalHint || !buyConfirmButton) {
      return;
    }

    buyEventName.textContent = state.title;
    buyEventMeta.textContent = `Доступно билетов: ${state.availableTickets} • Цена: ${state.price.toLocaleString('ru-RU')} ₽`;
    buyModalHint.textContent = state.availableTickets > 0
      ? 'После подтверждения будет совершен переход на страницу оплаты.'
      : 'На это мероприятие билеты временно недоступны.';

    updateQuantityOptions(state.availableTickets);
    hideBuyMessage();
    buyConfirmButton.disabled = state.availableTickets <= 0;
    buyConfirmButton.textContent = state.availableTickets > 0 ? 'Подтвердить заказ' : 'Билеты закончились';
  }

  function getLoginRedirectUrl() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const returnUrl = `${currentPath}${window.location.search}`;
    return `login.html?redirect=${encodeURIComponent(returnUrl)}`;
  }

  async function handleBuyConfirm() {
    console.error('HANDLE BUY CONFIRM START');

    if (isSubmitting) {
      console.error('Buy confirmation ignored because submission is already in progress.');
      return;
    }

    if (!ordersService) {
      console.error('Orders service is unavailable in buy flow.');
      showBuyMessage('danger', 'Сервис заказа билетов сейчас недоступен. Обновите страницу и попробуйте снова.');
      return;
    }

    if (!authService) {
      console.error('Auth service is unavailable in buy flow.');
      showBuyMessage('danger', 'Сервис авторизации сейчас недоступен. Обновите страницу и попробуйте снова.');
      return;
    }

    if (!activeBuyState && lastBuyTriggerButton) {
      setActiveBuyStateFromButton(lastBuyTriggerButton, 'confirm fallback');
    }

    if (!hasValidBuyState(activeBuyState)) {
      console.error('Buy confirmation aborted because activeBuyState is missing or invalid.', {
        activeBuyState,
        lastBuyTriggerButton,
        ordersServiceAvailable: Boolean(ordersService),
        authServiceAvailable: Boolean(authService),
        eventsServiceAvailable: Boolean(eventsService)
      });
      showBuyMessage('danger', 'Не удалось определить мероприятие для покупки. Закройте окно и попробуйте снова.');
      return;
    }

    if (!authService.isAuthenticated()) {
      window.location.href = getLoginRedirectUrl();
      return;
    }

    const quantity = Number(buyQuantitySelect?.value || 1);

    if (quantity > activeBuyState.availableTickets) {
      showBuyMessage('warning', 'Недостаточно доступных билетов для выбранного количества.');
      return;
    }

    setBuySubmittingState(true, 'Перенаправляем на оплату...');
    showBuyMessage('secondary', 'Подготавливаем заказ и страницу оплаты...');

    try {
      await delay(700);

      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.error('Buy confirmation aborted because current user is missing after auth check.', currentUser);
        showBuyMessage('danger', 'Не удалось определить текущего пользователя. Войдите в аккаунт ещё раз.');
        setBuySubmittingState(false, 'Подтвердить заказ');
        return;
      }

      const latestEvent = eventsService
        ? await eventsService.getEventById(activeBuyState.eventId)
        : activeBuyState;
      const latestStatus = getEventStatus(latestEvent);
      const latestAvailableTickets = Number(latestEvent.availableTickets || 0);

      if (latestStatus !== 'Опубликовано') {
        activeBuyState.availableTickets = latestAvailableTickets;
        syncBuyButtons(activeBuyState.eventId, latestAvailableTickets);
        updateEventPageAvailability(latestAvailableTickets);
        showBuyMessage(
          'warning',
          latestStatus === 'Приостановлено'
            ? 'Продажа билетов на это мероприятие временно приостановлена.'
            : 'Мероприятие снято с публикации и недоступно для покупки.'
        );
        setBuySubmittingState(false, 'Подтвердить заказ');
        return;
      }

      if (latestAvailableTickets <= 0) {
        activeBuyState.availableTickets = 0;
        syncBuyButtons(activeBuyState.eventId, 0);
        updateEventPageAvailability(0);
        showBuyMessage('warning', 'Билеты на это мероприятие закончились.');
        setBuySubmittingState(false, 'Билеты закончились');
        return;
      }

      if (quantity > latestAvailableTickets) {
        activeBuyState.availableTickets = latestAvailableTickets;
        syncBuyButtons(activeBuyState.eventId, latestAvailableTickets);
        updateEventPageAvailability(latestAvailableTickets);
        showBuyMessage('warning', 'Недостаточно доступных билетов для выбранного количества.');
        setBuySubmittingState(false, 'Подтвердить заказ');
        return;
      }

      await ordersService.createOrder({
        userId: currentUser.id,
        eventId: activeBuyState.eventId,
        quantity,
        totalPrice: activeBuyState.price * quantity,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      });
      console.error('CREATE ORDER FINISHED');

      await delay(700);
      console.error('DELAY FINISHED');
      showBuyMessage('info', 'Оплата подтверждена. Завершаем оформление билета...');
      console.error('SHOW BUY MESSAGE FINISHED');

      const nextAvailableTickets = Math.max(0, latestAvailableTickets - quantity);
      console.error('BEFORE UPDATE EVENT TICKETS', {
        eventId: activeBuyState.eventId,
        latestAvailableTickets,
        quantity,
        nextAvailableTickets
      });

      console.error('ORDER CREATED SUCCESSFULLY');
      console.error('BEFORE UPDATE EVENT TICKETS', {
        latestAvailableTickets,
        quantity,
        eventId: activeBuyState.eventId
      });

      const updatedEvent = await ordersService.updateEventTickets(
        activeBuyState.eventId,
        nextAvailableTickets
      );
      const updatedAvailableTickets = Number(updatedEvent.availableTickets);

      console.error('UPDATE EVENT TICKETS FINISHED', updatedEvent);

      activeBuyState.availableTickets = updatedAvailableTickets;
      if (lastBuyTriggerButton) {
        lastBuyTriggerButton.setAttribute('data-available-tickets', String(updatedAvailableTickets));
      }
      syncBuyButtons(activeBuyState.eventId, updatedAvailableTickets);
      updateEventPageAvailability(updatedAvailableTickets);
      if (window.KontramarkaEventPage?.applyPurchaseResult) {
        window.KontramarkaEventPage.applyPurchaseResult({
          ...updatedEvent,
          availableTickets: updatedAvailableTickets
        });
      }

      document.dispatchEvent(new CustomEvent('kontramarka:ticket-purchased', {
        detail: {
          eventId: activeBuyState.eventId,
          quantity,
          availableTickets: updatedAvailableTickets
        }
      }));
      const successToastText = updatedAvailableTickets > 0
        ? 'Заказ успешно оформлен. Количество доступных билетов обновлено.'
        : 'Заказ успешно оформлен. Это были последние доступные билеты.';

      setBuySubmittingState(false, updatedAvailableTickets > 0 ? 'Подтвердить заказ' : 'Билеты закончились');
      showBuyMessage('success', 'Покупка успешно оформлена. Заказ создан, оплата подтверждена.');

      await delay(1600);

      const modalInstance = window.bootstrap?.Modal.getOrCreateInstance(buyModalElement);
      pendingToastMessage = successToastText;
      if (modalInstance) {
        modalInstance.hide();
      } else {
        showPurchaseToast(successToastText);
        pendingToastMessage = '';
      }
    } catch (error) {
      console.error('Modal ticket purchase failed.', error);
      setBuySubmittingState(false, 'Подтвердить заказ');
      showBuyMessage('danger', 'Не удалось оформить заказ. Попробуйте ещё раз.');
    }
  }

  if (buyModalElement) {
    buyModalElement.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget || lastBuyTriggerButton;

      if (!button) {
        console.error('Buy modal opened without relatedTarget button.');
        activeBuyState = null;
        hideBuyMessage();
        showBuyMessage('danger', 'Не удалось получить данные мероприятия для покупки. Закройте окно и попробуйте снова.');
        return;
      }

      setActiveBuyStateFromButton(button, 'show.bs.modal');
    });

    buyModalElement.addEventListener('hidden.bs.modal', () => {
      const toastMessage = pendingToastMessage;

      activeBuyState = null;
      hideBuyMessage();
      setBuySubmittingState(false, 'Подтвердить заказ');
      pendingToastMessage = '';

      if (toastMessage) {
        window.setTimeout(() => {
          showPurchaseToast(toastMessage);
        }, 200);
      }
    });
  }

  document.addEventListener('click', (event) => {
    const buyButton = event.target.closest('[data-buy]');

    if (!buyButton) {
      return;
    }

    lastBuyTriggerButton = buyButton;
  });

  if (buyConfirmButton) {
    buyConfirmButton.addEventListener('click', handleBuyConfirm);
  } else {
    console.error('Buy confirm button is missing on page.');
  }
})();
