<template>
  <BaseLayout>
    <section class="event-content container py-4">
      <header>
        <h1 class="h4 mb-3">Популярные мероприятия</h1>
        <p class="text-muted mb-4">Нажмите на карточку, чтобы увидеть детали.</p>
      </header>
      <article class="row g-4 justify-content-center">
        <div class="col-12 col-md-6 col-xl-4" v-for="event in eventsStore.events" :key="event.id">
          <EventCard :event="event" @click="openEventModal(event)"/>
        </div>
      </article>
    </section>

    <EventModal
      v-if="selectedEvent"
      :key="selectedEvent?.id"
      v-model="isModalOpen"
      :event="selectedEvent"
      @buy-tickets="handleBuyTickets"
      @open-review="openReviewModal"
      @refresh-reviews="refreshReviews"
    />

    <ReviewModal
      v-if="isReviewModalOpen"
      v-model="isReviewModalOpen"
      :eventId="reviewEventId"
      @submit-review="handleSubmitReview"
    />
  </BaseLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'
import ReviewModal from '@/components/ReviewModal.vue'

export default {
  name: 'HomePage',
  components: { BaseLayout, EventCard, EventModal, ReviewModal },
  setup() {
    const eventsStore = useEventsStore()
    const selectedEvent = ref(null)
    const isModalOpen = ref(false)
    const isReviewModalOpen = ref(false)
    const reviewEventId = ref(null)
    const forceReviewRefresh = ref(0)

    const openEventModal = (event) => {
      selectedEvent.value = event
      isModalOpen.value = true
    }

    const openReviewModal = (eventId) => {
      reviewEventId.value = eventId
      isReviewModalOpen.value = true
    }

    const handleBuyTickets = async (ticketData) => {
      console.log('Покупка билетов:', ticketData)
      await eventsStore.loadEvents()
    }

    const handleSubmitReview = async (reviewData) => {
      console.log('Отзыв отправлен:', reviewData)
      forceReviewRefresh.value++
    }

    const refreshReviews = () => {
      forceReviewRefresh.value++
    }

    onMounted(() => {
      eventsStore.loadEvents()
    })

    return {
      eventsStore,
      selectedEvent,
      isModalOpen,
      isReviewModalOpen,
      reviewEventId,
      forceReviewRefresh,
      openEventModal,
      openReviewModal,
      handleBuyTickets,
      handleSubmitReview,
      refreshReviews
    }
  }
}
</script>
