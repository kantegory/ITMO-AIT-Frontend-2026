import { computed, ref, watch } from 'vue'
import { TravelApi } from '@/api/travelApi.js'

export function useReviews(destinationIdRef) {
  const reviews = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function loadReviews(id) {
    if (!id) {
      reviews.value = []
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const items = await TravelApi.getReviews(id)
      reviews.value = [...items].sort((left, right) => new Date(right.date) - new Date(left.date))
    } catch (err) {
      error.value = err?.message || 'Не удалось загрузить отзывы.'
      reviews.value = []
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => destinationIdRef.value,
    (id) => loadReviews(id),
    { immediate: true }
  )

  async function addReview({ name, rating, text }) {
    const id = destinationIdRef.value
    if (!id) return
    const created = await TravelApi.addReview({
      destinationId: Number(id),
      name,
      rating: Number(rating),
      text,
      date: new Date().toISOString()
    })
    reviews.value = [created, ...reviews.value]
  }

  const averageRating = computed(() => {
    if (!reviews.value.length) return 0
    const sum = reviews.value.reduce((acc, item) => acc + Number(item.rating || 0), 0)
    return Math.round((sum / reviews.value.length) * 10) / 10
  })

  return { reviews, isLoading, error, averageRating, addReview }
}
