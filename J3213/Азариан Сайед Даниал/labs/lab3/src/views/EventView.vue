<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import { EVENT_CATALOG, useEvents } from '../composables/useEvents'
import { useTickets } from '../composables/useTickets'

const route = useRoute()
const router = useRouter()
const { findOrganizerEventByRouteId } = useEvents()
const { toastMessage, toastType, purchaseTicket } = useTickets()

const eventData = ref(null)
const loading = ref(false)
const purchasing = ref(false)

const priceLabel = computed(() => `от ${Number(eventData.value?.price || 0).toLocaleString('ru-RU')} руб.`)

async function loadEvent() {
  loading.value = true
  const eventId = String(route.params.eventId || 'symphonic-cinema-night')
  const organizerEvent = await findOrganizerEventByRouteId(eventId)
  eventData.value = organizerEvent || EVENT_CATALOG[eventId] || EVENT_CATALOG['symphonic-cinema-night']
  document.title = `EventPass - ${eventData.value.name}`
  loading.value = false
}

async function buyEventTicket() {
  purchasing.value = true

  try {
    const result = await purchaseTicket(eventData.value)
    if (result.redirect) {
      router.push(result.redirect)
    }
  } finally {
    purchasing.value = false
  }
}

onMounted(loadEvent)
watch(() => route.params.eventId, loadEvent)
</script>

<template>
  <AppNavbar active-page="event" />

  <main class="py-4 py-lg-5">
    <div class="container">
      <div v-if="loading || !eventData" class="alert alert-light border">Загружаем мероприятие...</div>

      <template v-else>
        <section class="cabinet-card overflow-hidden mb-4">
          <div class="row g-0">
            <div class="col-lg-5">
              <img :src="eventData.posterImage" class="w-100 h-100 object-fit-cover" :alt="`Афиша мероприятия ${eventData.name}`" />
            </div>
            <div class="col-lg-7 p-4">
              <p class="small text-secondary mb-2">{{ eventData.category }} | {{ eventData.date }} | {{ eventData.time }}</p>
              <h1 class="h3 mb-3">{{ eventData.name }}</h1>
              <p class="mb-3">{{ eventData.description }}</p>
              <ul class="list-unstyled small text-secondary mb-4">
                <li>Город: {{ eventData.city }}</li>
                <li>Площадка: {{ eventData.venue }}</li>
                <li>Возрастное ограничение: {{ eventData.age }}</li>
              </ul>
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span class="h5 m-0">{{ priceLabel }}</span>
                <button class="btn btn-primary" type="button" :disabled="purchasing" @click="buyEventTicket">
                  Купить билет
                </button>
              </div>
            </div>
          </div>
        </section>

        <div class="row g-4">
          <div class="col-lg-6">
            <section class="cabinet-card p-4 h-100">
              <h2 class="h5 mb-3">Место проведения</h2>
              <p class="mb-2">{{ eventData.venueAddress }}</p>
              <p class="text-secondary small mb-0">{{ eventData.venueDetails }}</p>
            </section>
          </div>
          <div class="col-lg-6">
            <section class="cabinet-card p-4 h-100">
              <h2 class="h5 mb-3">Схема зала</h2>
              <img :src="eventData.hallSchemeImage" class="w-100 rounded" :alt="`Схема зала ${eventData.venue}`" />
            </section>
          </div>
        </div>

        <section class="cabinet-card p-4 mt-4">
          <h2 class="h5 mb-3">Отзывы</h2>
          <div class="d-grid gap-3">
            <article v-for="review in eventData.reviews" :key="`${review.author}-${review.text}`" class="border rounded p-3">
              <p class="mb-1 fw-semibold">{{ review.author }}</p>
              <p class="small text-secondary mb-0">{{ review.text }}</p>
            </article>
          </div>
        </section>
      </template>
    </div>
  </main>

  <div
    v-if="toastMessage"
    class="toast align-items-center border-0 position-fixed top-0 end-0 m-3 show"
    :class="`text-bg-${toastType}`"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    style="z-index: 1080"
  >
    <div class="d-flex">
      <div class="toast-body">{{ toastMessage }}</div>
    </div>
  </div>
</template>
