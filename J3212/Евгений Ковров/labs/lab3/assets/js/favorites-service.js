(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize favorites service.');
  }

  const { apiClient } = global.KontramarkaApi;

  async function getFavoritesByUser(userId) {
    const response = await apiClient.get('/favorites');

    return response.data.filter((favorite) => String(favorite.userId) === String(userId));
  }

  async function getFavoriteByUserAndEvent(userId, eventId) {
    const favorites = await getFavoritesByUser(userId);
    return favorites.find((favorite) => String(favorite.eventId) === String(eventId)) || null;
  }

  async function addFavorite({ userId, eventId }) {
    const response = await apiClient.post('/favorites', {
      userId,
      eventId: String(eventId),
      createdAt: new Date().toISOString()
    });

    return response.data;
  }

  async function removeFavorite(favoriteId) {
    await apiClient.delete(`/favorites/${favoriteId}`);
  }

  global.KontramarkaFavoritesService = {
    getFavoritesByUser,
    getFavoriteByUserAndEvent,
    addFavorite,
    removeFavorite
  };
})(window);
