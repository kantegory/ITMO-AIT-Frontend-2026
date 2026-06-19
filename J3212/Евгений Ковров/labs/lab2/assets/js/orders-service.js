(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize orders service.');
  }

  const { apiClient } = global.KontramarkaApi;

  async function createOrder(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  }

  async function getOrdersByUser(userId) {
    const response = await apiClient.get('/orders', {
      params: {
        userId
      }
    });

    return response.data;
  }

  async function updateEventTickets(eventId, newAvailableTickets) {
    console.error('PATCH UPDATE EVENT TICKETS CALLED', eventId, newAvailableTickets);

    const response = await apiClient.patch(`/events/${eventId}`, {
      availableTickets: Number(newAvailableTickets)
    });

    console.error('PATCH UPDATE EVENT TICKETS RESPONSE', response.data);

    return response.data;
  }

  global.KontramarkaOrdersService = {
    createOrder,
    getOrdersByUser,
    updateEventTickets
  };
})(window);