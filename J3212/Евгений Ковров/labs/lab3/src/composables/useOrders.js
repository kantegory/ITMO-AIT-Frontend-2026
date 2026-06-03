import { ref } from 'vue';
import { fetchEventById } from '../api/events';
import {
  createOrder as createOrderRequest,
  fetchOrdersByUser,
  updateEventTickets
} from '../api/orders';

const orders = ref([]);
const orderEntries = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const successMessage = ref('');

function clearStatus() {
  error.value = '';
  successMessage.value = '';
}

function sortByNewest(items) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.createdAt).getTime();
    const rightDate = new Date(right.createdAt).getTime();
    return rightDate - leftDate;
  });
}

function sortEntriesByNewest(items) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.order.createdAt).getTime();
    const rightDate = new Date(right.order.createdAt).getTime();
    return rightDate - leftDate;
  });
}

async function loadOrdersByUser(userId) {
  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const loadedOrders = await fetchOrdersByUser(userId);
    orders.value = sortByNewest(Array.isArray(loadedOrders) ? loadedOrders : []);

    orderEntries.value = await Promise.all(orders.value.map(async (order) => {
      try {
        const event = await fetchEventById(order.eventId);
        return { order, event };
      } catch (requestError) {
        if (requestError.response?.status === 404) {
          return { order, event: null };
        }

        throw requestError;
      }
    }));
    orderEntries.value = sortEntriesByNewest(orderEntries.value);

    return orderEntries.value;
  } catch (requestError) {
    console.error('Orders loading failed.', requestError);
    error.value = 'Не удалось загрузить ваши заказы. Попробуйте позже.';
    throw requestError;
  } finally {
    isLoading.value = false;
  }
}

async function purchaseTickets({ user, event, quantity }) {
  isSubmitting.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    if (!user?.id) {
      const authError = new Error('AUTH_REQUIRED');
      authError.code = 'AUTH_REQUIRED';
      throw authError;
    }

    if (!event?.id) {
      const notFoundError = new Error('EVENT_NOT_FOUND');
      notFoundError.code = 'EVENT_NOT_FOUND';
      throw notFoundError;
    }

    const latestEvent = await fetchEventById(event.id);
    const latestStatus = latestEvent.status || 'Опубликовано';
    const latestAvailableTickets = Number(latestEvent.availableTickets || 0);
    const normalizedQuantity = Number(quantity || 1);

    if (latestStatus !== 'Опубликовано') {
      const statusError = new Error('EVENT_UNAVAILABLE');
      statusError.code = 'EVENT_UNAVAILABLE';
      statusError.event = latestEvent;
      throw statusError;
    }

    if (latestAvailableTickets <= 0) {
      const soldOutError = new Error('SOLD_OUT');
      soldOutError.code = 'SOLD_OUT';
      soldOutError.event = latestEvent;
      throw soldOutError;
    }

    if (normalizedQuantity > latestAvailableTickets) {
      const quantityError = new Error('NOT_ENOUGH_TICKETS');
      quantityError.code = 'NOT_ENOUGH_TICKETS';
      quantityError.event = latestEvent;
      throw quantityError;
    }

    const createdOrder = await createOrderRequest({
      userId: user.id,
      eventId: latestEvent.id,
      quantity: normalizedQuantity,
      totalPrice: Number(latestEvent.price || 0) * normalizedQuantity,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    });

    const updatedEvent = await updateEventTickets(
      latestEvent.id,
      Math.max(0, latestAvailableTickets - normalizedQuantity)
    );

    successMessage.value = updatedEvent.availableTickets > 0
      ? 'Покупка успешно оформлена. Заказ создан, количество билетов обновлено.'
      : 'Покупка успешно оформлена. Это были последние доступные билеты.';

    const createdEntry = {
      order: createdOrder,
      event: updatedEvent
    };

    orders.value = sortByNewest([createdOrder, ...orders.value]);
    orderEntries.value = sortEntriesByNewest([createdEntry, ...orderEntries.value]);

    return {
      order: createdOrder,
      updatedEvent
    };
  } catch (requestError) {
    console.error('Ticket purchase failed.', requestError);

    if (requestError.code === 'AUTH_REQUIRED') {
      error.value = 'Чтобы купить билет, войдите в аккаунт.';
    } else if (requestError.code === 'EVENT_NOT_FOUND' || requestError.response?.status === 404) {
      error.value = 'Мероприятие не найдено.';
    } else if (requestError.code === 'EVENT_UNAVAILABLE') {
      error.value = requestError.event?.status === 'Приостановлено'
        ? 'Продажа билетов на это мероприятие временно приостановлена.'
        : 'Мероприятие недоступно для покупки.';
    } else if (requestError.code === 'SOLD_OUT') {
      error.value = 'Билеты на это мероприятие закончились.';
    } else if (requestError.code === 'NOT_ENOUGH_TICKETS') {
      error.value = 'Недостаточно доступных билетов для выбранного количества.';
    } else {
      error.value = 'Не удалось оформить заказ. Попробуйте ещё раз.';
    }

    throw requestError;
  } finally {
    isSubmitting.value = false;
  }
}

export function useOrders() {
  return {
    orders,
    orderEntries,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    clearStatus,
    loadOrdersByUser,
    purchaseTickets
  };
}
