import { ref } from 'vue';
import { fetchEventById } from '../api/events';
import {
  createFavorite,
  deleteFavorite,
  fetchFavoriteByUserAndEvent,
  fetchFavoritesByUser
} from '../api/favorites';

const favorites = ref([]);
const favoriteEntries = ref([]);
const currentFavorite = ref(null);
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
    const leftDate = new Date(left.favorite.createdAt).getTime();
    const rightDate = new Date(right.favorite.createdAt).getTime();
    return rightDate - leftDate;
  });
}

async function loadFavoritesByUser(userId) {
  isLoading.value = true;
  error.value = '';

  try {
    const loadedFavorites = await fetchFavoritesByUser(userId);
    favorites.value = sortByNewest(Array.isArray(loadedFavorites) ? loadedFavorites : []);

    favoriteEntries.value = await Promise.all(favorites.value.map(async (favorite) => {
      try {
        const event = await fetchEventById(favorite.eventId);
        return { favorite, event };
      } catch (requestError) {
        if (requestError.response?.status === 404) {
          return { favorite, event: null };
        }

        throw requestError;
      }
    }));

    favoriteEntries.value = sortEntriesByNewest(favoriteEntries.value);
    return favoriteEntries.value;
  } catch (requestError) {
    console.error('Favorites loading failed.', requestError);
    error.value = 'Не удалось загрузить избранное. Попробуйте позже.';
    throw requestError;
  } finally {
    isLoading.value = false;
  }
}

async function loadFavoriteByUserAndEvent(userId, eventId) {
  isLoading.value = true;
  error.value = '';

  try {
    currentFavorite.value = await fetchFavoriteByUserAndEvent(userId, eventId);
    return currentFavorite.value;
  } catch (requestError) {
    console.error('Favorite loading failed.', requestError);
    error.value = 'Не удалось загрузить избранное. Попробуйте позже.';
    throw requestError;
  } finally {
    isLoading.value = false;
  }
}

async function toggleFavorite({ user, event }) {
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
      const eventError = new Error('EVENT_NOT_FOUND');
      eventError.code = 'EVENT_NOT_FOUND';
      throw eventError;
    }

    const existingFavorite = await fetchFavoriteByUserAndEvent(user.id, event.id);

    if (existingFavorite) {
      await deleteFavorite(existingFavorite.id);
      currentFavorite.value = null;
      favorites.value = favorites.value.filter((favorite) => String(favorite.id) !== String(existingFavorite.id));
      favoriteEntries.value = favoriteEntries.value.filter((entry) => String(entry.favorite.id) !== String(existingFavorite.id));
      successMessage.value = 'Мероприятие удалено из избранного.';
      return null;
    }

    const createdFavorite = await createFavorite({
      userId: user.id,
      eventId: event.id
    });

    currentFavorite.value = createdFavorite;
    favorites.value = sortByNewest([createdFavorite, ...favorites.value]);
    favoriteEntries.value = sortEntriesByNewest([{ favorite: createdFavorite, event }, ...favoriteEntries.value]);
    successMessage.value = 'Мероприятие добавлено в избранное.';
    return createdFavorite;
  } catch (requestError) {
    console.error('Favorite toggle failed.', requestError);

    if (requestError.code === 'AUTH_REQUIRED') {
      error.value = 'Чтобы добавить событие в избранное, войдите в аккаунт.';
    } else if (requestError.code === 'EVENT_NOT_FOUND') {
      error.value = 'Мероприятие не найдено.';
    } else {
      error.value = 'Не удалось обновить избранное. Попробуйте позже.';
    }

    throw requestError;
  } finally {
    isSubmitting.value = false;
  }
}

export function useFavorites() {
  return {
    favorites,
    favoriteEntries,
    currentFavorite,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    clearStatus,
    loadFavoritesByUser,
    loadFavoriteByUserAndEvent,
    toggleFavorite
  };
}
