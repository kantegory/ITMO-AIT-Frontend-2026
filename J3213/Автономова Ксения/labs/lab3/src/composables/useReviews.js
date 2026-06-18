import { ref } from 'vue'
import apiClient from '../api/client'
export function useReviews() {
  const reviews = ref([])
  async function loadReviews(eventId) {
    const { data } = await apiClient.get('/reviews', { params: { eventId } })
    reviews.value = data || []
    return reviews.value
  }
  async function createReview(payload) {
    const { data } = await apiClient.post('/600/reviews', payload)
    reviews.value.push(data)
    return data
  }
  return {
    reviews,
    loadReviews,
    createReview
  }
}
