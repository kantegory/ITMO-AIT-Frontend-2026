<template>
  <Navbar/>
  <main id="main-content" class="container py-4">
    <slot/>
  </main>
  <EventModal
    v-if="modalState.isOpen"
    v-model="modalState.isOpen"
    :event="modalState.event"
    @buy-tickets="handleBuyTickets"
  />
  <ReviewModal
    v-if="reviewModalState.isOpen"
    v-model="reviewModalState.isOpen"
    :eventId="reviewModalState.eventId"
    @submit-review="handleSubmitReview"
  />
</template>

<script>
import { reactive } from 'vue'
import Navbar from '@/components/Navbar.vue'
import EventModal from '@/components/EventModal.vue'
import ReviewModal from '@/components/ReviewModal.vue'

export default {
  name: 'BaseLayout',
  components: { Navbar, EventModal, ReviewModal },
  setup() {
    const modalState = reactive({
      isOpen: false,
      event: null
    })

    const reviewModalState = reactive({
      isOpen: false,
      eventId: null
    })

    const openEventModal = (event) => {
      modalState.event = event
      modalState.isOpen = true
    }

    const openReviewModal = (eventId) => {
      reviewModalState.eventId = eventId
      reviewModalState.isOpen = true
    }

    const handleBuyTickets = (ticketData) => {
      console.log('Покупка билетов:', ticketData)
      alert(`Билеты куплены!\nМеста: ${ticketData.seats.join(', ')}\nСумма: ${ticketData.totalPrice} ₽`)
      modalState.isOpen = false
    }

    const handleSubmitReview = (reviewData) => {
      console.log('Отзыв отправлен:', reviewData)
      alert('Спасибо за отзыв!')
      reviewModalState.isOpen = false
    }

    return {
      modalState,
      reviewModalState,
      openEventModal,
      openReviewModal,
      handleBuyTickets,
      handleSubmitReview
    }
  }
}
</script>
