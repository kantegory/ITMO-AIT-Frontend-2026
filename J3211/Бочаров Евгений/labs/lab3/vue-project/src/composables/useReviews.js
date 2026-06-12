import { ref } from 'vue'
import { ReviewsAPI } from '@/api/endpoints'

export function useReviews() {
    const reviews = ref([])
    const loading = ref(false)

    const fetchReviews = async (eventId) => {
        loading.value = true
        reviews.value = await ReviewsAPI.getByEventId(eventId)
        loading.value = false
    }

    const addReview = async (data) => {
        await ReviewsAPI.create(data)
        await fetchReviews(data.eventId)
    }

    return { reviews, loading, fetchReviews, addReview }
}