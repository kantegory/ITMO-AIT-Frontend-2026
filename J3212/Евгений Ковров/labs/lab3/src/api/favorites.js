import apiClient from './axios';

export async function fetchFavoritesByUser(userId) {
  const response = await apiClient.get('/favorites');
  return response.data.filter((favorite) => String(favorite.userId) === String(userId));
}

export async function fetchFavoriteByUserAndEvent(userId, eventId) {
  const favorites = await fetchFavoritesByUser(userId);
  return favorites.find((favorite) => String(favorite.eventId) === String(eventId)) || null;
}

export async function createFavorite({ userId, eventId }) {
  const response = await apiClient.post('/favorites', {
    userId,
    eventId: String(eventId),
    createdAt: new Date().toISOString()
  });

  return response.data;
}

export async function deleteFavorite(favoriteId) {
  await apiClient.delete(`/favorites/${favoriteId}`);
}
