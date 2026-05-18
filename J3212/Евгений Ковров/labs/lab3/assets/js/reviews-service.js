(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize reviews service.');
  }

  const { apiClient } = global.KontramarkaApi;

  async function getReviewsByEvent(eventId) {
    const response = await apiClient.get('/reviews');

    return response.data
      .filter((review) => String(review.eventId) === String(eventId))
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  async function createReview(reviewData) {
    const response = await apiClient.post('/reviews', {
      ...reviewData,
      eventId: String(reviewData.eventId),
      createdAt: new Date().toISOString()
    });

    return response.data;
  }

  global.KontramarkaReviewsService = {
    getReviewsByEvent,
    createReview
  };
})(window);
