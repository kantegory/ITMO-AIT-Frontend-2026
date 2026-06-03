import { ref } from 'vue';
import {
  createEvent as createEventRequest,
  fetchEventById,
  fetchEvents,
  updateEvent as updateEventRequest
} from '../api/events';

function normalizeEvent(event) {
  const capacity = Number(event?.capacity || Math.max(Number(event?.availableTickets || 0), 100));

  return {
    ...event,
    capacity,
    availableTickets: Number(event?.availableTickets || 0),
    price: Number(event?.price || 0),
    status: event?.status || 'Опубликовано'
  };
}

function buildEventsParams(options) {
  const where = {};
  const filters = options.filters || {};
  const searchValue = filters.search?.trim();

  if (filters.onlyAvailable) {
    where.availableTickets = { gt: 0 };
  }

  if (filters.category && filters.category !== 'Все') {
    where.category = { eq: filters.category };
  }

  if (filters.city && filters.city !== 'Все') {
    where.city = { eq: filters.city };
  }

  if (searchValue) {
    where.or = ['title', 'description', 'city', 'venue', 'category'].map((field) => ({
      [field]: { contains: searchValue }
    }));
  }

  return Object.keys(where).length
    ? { _where: JSON.stringify(where) }
    : {};
}

export function useEvents() {
  const events = ref([]);
  const currentEvent = ref(null);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref('');

  async function loadEvents(options = {}) {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedEvents = await fetchEvents(buildEventsParams(options));
      const normalizedEvents = Array.isArray(loadedEvents)
        ? loadedEvents.map(normalizeEvent)
        : [];

      events.value = normalizedEvents;

      return events.value;
    } catch (requestError) {
      console.error('Events loading failed.', requestError);
      error.value = 'Не удалось загрузить мероприятия. Попробуйте позже.';
      throw requestError;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadEventById(id) {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedEvent = await fetchEventById(id);
      currentEvent.value = normalizeEvent(loadedEvent);
      return currentEvent.value;
    } catch (requestError) {
      console.error(`Event loading failed for id ${id}.`, requestError);
      error.value = requestError.response?.status === 404
        ? 'Мероприятие не найдено.'
        : 'Не удалось загрузить данные мероприятия. Попробуйте позже.';
      throw requestError;
    } finally {
      isLoading.value = false;
    }
  }

  async function createEvent(payload) {
    isSubmitting.value = true;
    error.value = '';

    try {
      const createdEvent = normalizeEvent(await createEventRequest(payload));
      events.value = [...events.value, createdEvent];
      return createdEvent;
    } catch (requestError) {
      console.error('Event creation failed.', requestError);
      error.value = 'Не удалось сохранить событие. Попробуйте позже.';
      throw requestError;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function updateEvent(id, payload) {
    isSubmitting.value = true;
    error.value = '';

    try {
      const updatedEvent = normalizeEvent(await updateEventRequest(id, payload));
      events.value = events.value.map((event) => String(event.id) === String(id) ? updatedEvent : event);

      if (String(currentEvent.value?.id) === String(id)) {
        currentEvent.value = updatedEvent;
      }

      return updatedEvent;
    } catch (requestError) {
      console.error(`Event update failed for id ${id}.`, requestError);
      error.value = 'Не удалось сохранить событие. Попробуйте позже.';
      throw requestError;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    events,
    currentEvent,
    isLoading,
    isSubmitting,
    error,
    loadEvents,
    loadEventById,
    createEvent,
    updateEvent
  };
}
