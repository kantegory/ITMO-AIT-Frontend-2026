<template>
  <section class="page container py-4">
    <div class="mb-3">
      <RouterLink :to="{ name: 'home' }" class="text-decoration-none small text-secondary" aria-label="Вернуться к списку мероприятий">
        &larr; К списку мероприятий
      </RouterLink>
    </div>

    <p v-if="loading" class="text-secondary" role="status">Загрузка…</p>

    <article v-else-if="event && !notFound" id="eventPage">
      <header class="mb-4">
        <h1 class="h4 mb-1">{{ event.title }}</h1>
        <p class="text-secondary mb-0">{{ cityLabel(event.city) }} · {{ event.date }}</p>
      </header>

      <p class="mb-4">{{ event.description }}</p>

      <div class="row g-4 mb-4">
        <div class="col-12 col-md-6">
          <h2 class="h6 mb-2 d-inline-flex align-items-center gap-2">
            <svg class="sprite-icon text-secondary" width="18" height="18" aria-hidden="true" focusable="false">
              <use href="#icon-building" />
            </svg>
            <span>Место проведения</span>
          </h2>
          <p class="small mb-0">{{ event.venue }}</p>
        </div>
        <SeatMapPreview />
      </div>

      <hr class="my-4" />
      <h2 id="reviewsHeading" class="h6 mb-2">Отзывы</h2>
      <ul class="list-group list-group-flush mb-4" aria-labelledby="reviewsHeading">
        <li v-for="(text, idx) in reviews" :key="idx" class="list-group-item">{{ text }}</li>
      </ul>

      <div>
        <button type="button" class="btn btn-success" :aria-label="'Купить билет на мероприятие: ' + (event.title || '')" @click="buy">
          Купить билет
        </button>
      </div>
    </article>

    <p v-else-if="notFound || errorText" class="text-secondary small" role="alert">{{ errorText }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import SeatMapPreview from '@/components/SeatMapPreview.vue'
import { http, unwrap } from '@/api/http'
import { useAuth } from '@/composables/useAuth'
import { useCity } from '@/composables/useCity'
import { useEventsApi } from '@/composables/useEventsApi'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { getEventById } = useEventsApi()
const { cityLabel } = useCity()
const { currentUser, isLoggedIn } = useAuth()
const { show } = useToast()

const loading = ref(true)
const event = ref(null)
const notFound = ref(false)
const errorText = ref('')

const reviews = computed(() => {
  const r = event.value?.reviews
  if (r && r.length) return r
  return ['Пока нет отзывов.']
})

async function load() {
  loading.value = true
  notFound.value = false
  event.value = null
  errorText.value = ''
  const id = route.params.id
  try {
    const ev = await getEventById(id)
    event.value = ev
  } catch (e) {
    notFound.value = true
    const m = e?.message ? String(e.message) : ''
    errorText.value =
      m && m !== 'not found'
        ? `Не удалось открыть мероприятие: ${m}`
        : 'Мероприятие не найдено. Откройте главную, дождитесь списка и снова нажмите «Подробнее». Убедитесь, что в папке lab2 запущен npm run api.'
  } finally {
    loading.value = false
  }
}

async function buy() {
  if (!isLoggedIn.value || !currentUser.value?.id) {
    show('Сначала войти в аккаунт')
    await router.push({
      name: 'login',
      query: { redirect: route.fullPath },
    })
    return
  }
  const ev = event.value
  try {
    const res = await http.post('/tickets', {
      userId: currentUser.value.id,
      eventId: ev.id,
      eventTitle: ev.title,
      date: ev.date,
      city: cityLabel(ev.city),
      price: ev.priceFrom,
    })
    await unwrap(res, 'Не удалось оформить билет')
    show('Билет сохранён. Его можно посмотреть в личном кабинете.')
  } catch {
    show('Не удалось оформить билет')
  }
}

onMounted(load)

watch(
  () => route.params.id,
  () => load(),
)
</script>
