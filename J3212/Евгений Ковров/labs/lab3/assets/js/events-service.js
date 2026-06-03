(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize events service.');
  }

  const { apiClient } = global.KontramarkaApi;

  async function getEvents() {
    try {
      const response = await apiClient.get('/events');
      return response.data;
    } catch (error) {
      console.error('Failed to load events.', error);
      throw error;
    }
  }

  async function getEventById(id) {
    try {
      const response = await apiClient.get(`/events/${id}`, {
        params: {
          _ts: Date.now()
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to load event with id ${id}.`, error);
      throw error;
    }
  }

  global.KontramarkaEventsService = {
    getEvents,
    getEventById
  };
})(window);
