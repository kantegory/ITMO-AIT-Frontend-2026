<template>
  <BaseLayout>
    <section class="container-fluid py-4">
      <button class="btn btn-outline-primary w-100 mb-3 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#filtersCollapse">Фильтры</button>
      <article class="row">
        <aside class="col-12 col-lg-3 mb-4">
          <section class="filter-box p-4 collapse d-lg-block" id="filtersCollapse">
            <header><h2 class="h6 mb-3">Фильтры</h2></header>

            <!-- 🔍 ПОИСК ПО НАЗВАНИЮ -->
            <fieldset class="mb-3">
              <legend class="form-label small">Поиск</legend>
              <input
                type="text"
                v-model="filters.search"
                class="form-control form-control-sm"
                placeholder="Название мероприятия..."
              >
            </fieldset>

            <fieldset class="mb-3">
              <legend class="form-label small">Тип</legend>
              <select class="form-select form-select-sm" v-model="filters.type">
                <option value="">Все</option>
                <option value="Концерт">Концерт</option>
                <option value="Театр">Театр</option>
                <option value="Выставка">Выставка</option>
              </select>
            </fieldset>
            <fieldset class="mb-3">
              <legend class="form-label small">Город</legend>
              <select class="form-select form-select-sm" v-model="filters.city">
                <option value="">Все</option>
                <option value="Москва">Москва</option>
                <option value="СПб">СПб</option>
              </select>
            </fieldset>
          </section>
        </aside>
        <section class="col-12 col-lg-9">
          <header><h1 class="h4 mb-3">Результаты поиска</h1></header>
          <article class="row g-4">
            <div class="col-12 col-md-6 col-xl-4" v-for="event in filteredEvents" :key="event.id">
              <EventCard :event="event" @click="openEventModal(event)"/>
            </div>
          </article>
          <p v-if="filteredEvents.length === 0" class="text-muted text-center py-4">
            Ничего не найдено по заданным фильтрам
          </p>
        </section>
      </article>
    </section>

    <EventModal
      v-if="selectedEvent"
      :key="selectedEvent?.id"
      v-model="isModalOpen"
      :event="selectedEvent"
      @buy-tickets="handleBuyTickets"
      @open-review="openReviewModal"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'
import ReviewModal from '@/components/ReviewModal.vue'

export default {
  name: 'SearchPage',
  components: { BaseLayout, EventCard, EventModal, ReviewModal },
  setup() {
    const eventsStore = useEventsStore()
    const filters = reactive({
      search: '',
      type: '',
      city: ''
    })
    const selectedEvent = ref(null)
    const isModalOpen = ref(false)
    const isReviewModalOpen = ref(false)
    const reviewEventId = ref(null)

    const filteredEvents = computed(() => {
      let result = eventsStore.events

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(e =>
          e.title && e.title.toLowerCase().includes(searchLower)
        )
      }

      if (filters.type) {
        result = result.filter(e => e.type === filters.type)
      }

      if (filters.city) {
        result = result.filter(e => e.city === filters.city)
      }

      return result
    })

    const applyFilters = () => {
      console.log('Применены фильтры:', filters)
    }

    const resetFilters = () => {
      filters.search = ''
      filters.type = ''
      filters.city = ''
    }

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
      console.log('Отзыв:', reviewData)
    }

    onMounted(() => {
      eventsStore.loadEvents()
    })

    return {
      eventsStore,
      filters,
      filteredEvents,
      selectedEvent,
      isModalOpen,
      isReviewModalOpen,
      reviewEventId,
      applyFilters,
      resetFilters,
      openEventModal,
      openReviewModal,
      handleBuyTickets,
      handleSubmitReview
    }
  }
}
</script>
