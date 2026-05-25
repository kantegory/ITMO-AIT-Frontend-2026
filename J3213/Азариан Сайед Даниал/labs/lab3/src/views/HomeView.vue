<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '../components/AppFooter.vue'
import AppNavbar from '../components/AppNavbar.vue'
import EventCard from '../components/EventCard.vue'
import EventSearch from '../components/EventSearch.vue'
import { useEvents } from '../composables/useEvents'
import { useTickets } from '../composables/useTickets'

const router = useRouter()
const { events, apiEventsCount, organizerEventsCount, loading, error, cityOptions, loadEvents } = useEvents()
const { toastMessage, toastType, purchaseTicket } = useTickets()

const filters = reactive({
  searchText: '',
  selectedDate: '',
  selectedCity: '',
})

const visibleCount = ref(9)
const purchasing = ref(false)

const visibleEvents = computed(() => events.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < events.value.length)
const statusMessage = computed(() => {
  if (loading.value) {
    return 'Загружаем мероприятия...'
  }

  if (!events.value.length && error.value) {
    return error.value
  }

  if (!events.value.length) {
    return 'Пока нет мероприятий.'
  }

  return `Показаны ${visibleEvents.value.length} из ${events.value.length} мероприятий (API: ${apiEventsCount.value}, организаторы: ${organizerEventsCount.value}).`
})

onMounted(() => {
  loadEvents()
})

async function runSearch() {
  visibleCount.value = 9
  await loadEvents(filters)
}

function loadMore() {
  visibleCount.value += 9
}

async function buyTicket(eventItem) {
  purchasing.value = true

  try {
    const result = await purchaseTicket(eventItem)
    if (result.redirect) {
      router.push(result.redirect)
    }
  } finally {
    purchasing.value = false
  }
}
</script>

<template>
  <AppNavbar active-page="home" />

  <main class="home-page">
    <section class="hero-section py-5">
      <div class="container py-3 py-lg-5">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <span class="badge text-bg-light border mb-3">Билеты на концерты, театры, спорт и шоу</span>
            <h1 class="display-5 fw-bold mb-3">Покупайте билеты на лучшие события вашего города</h1>
            <p class="lead text-secondary mb-4">
              Выбирайте места, сравнивайте цены и получайте электронный билет за пару минут.
            </p>
            <EventSearch v-model="filters" :cities="cityOptions" :loading="loading" @search="runSearch" />
          </div>

          <div class="col-lg-5">
            <div class="hero-highlight p-4 p-md-5">
              <p class="text-uppercase small fw-semibold mb-2">Событие недели</p>
              <h2 class="h4 mb-3">Symphonic Cinema Night</h2>
              <p class="mb-4 text-secondary">
                Живой оркестр и музыка из легендарных фильмов. 21 апреля, 19:00, Vegas City Hall.
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-semibold">от 2 500 руб.</span>
                <RouterLink class="btn btn-dark" to="/events/symphonic-cinema-night">Подробнее</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h2 class="h3 m-0">Мероприятия</h2>
        </div>

        <div class="row g-4">
          <div v-for="event in visibleEvents" :key="`${event.source}-${event.id}`" class="col-sm-6 col-lg-4">
            <EventCard :event="event" :purchasing="purchasing" @buy="buyTicket" />
          </div>
        </div>

        <div class="mt-3">
          <div class="alert border mb-0" :class="error && !events.length ? 'alert-danger' : 'alert-light'">
            {{ statusMessage }}
          </div>
        </div>

        <div v-if="hasMore" class="text-center mt-4">
          <button class="btn btn-outline-primary" type="button" @click="loadMore">Показать еще 9</button>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light border-top border-bottom">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="feature-box h-100">
              <h3 class="h5">Удобный выбор мест</h3>
              <p class="mb-0 text-secondary">Интерактивная схема зала и быстрый подбор лучших мест.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box h-100">
              <h3 class="h5">Безопасная оплата</h3>
              <p class="mb-0 text-secondary">Оплачивайте банковской картой, СБП или электронным кошельком.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box h-100">
              <h3 class="h5">Мгновенный билет</h3>
              <p class="mb-0 text-secondary">Билет приходит на почту и доступен в личном кабинете сразу после оплаты.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 organizer-cta">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <h2 class="h3 mb-2">Проводите свои события с EventPass</h2>
            <p class="text-secondary mb-0">
              Создавайте мероприятия, управляйте продажами и аналитикой в кабинете организатора.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink class="btn btn-primary btn-lg" to="/auth">Стать организатором</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />

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
