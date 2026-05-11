<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useDestinations, labelMaps } from '@/composables/useDestinations.js'
import { useFavorites } from '@/composables/useFavorites.js'
import { useRoutes } from '@/composables/useRoutes.js'
import { useReviews } from '@/composables/useReviews.js'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { getDestination, loadDestinations } = useDestinations()
const { isFavorite, add, loadFavorites } = useFavorites()
const { routes, addRoute, attachDestination, loadRoutes } = useRoutes()
const { showToast } = useToast()

const destinationId = computed(() => Number(route.params.id))
const destination = ref(null)
const isResolving = ref(true)
const activeAccordion = ref(0)

const { reviews, addReview } = useReviews(destinationId)

const isAddRouteOpen = ref(false)
const showNewRouteFields = ref(false)
const existingRouteSelection = ref('')
const newRouteForm = ref({ name: '', duration: '', budget: '' })
const reviewForm = ref({ name: '', rating: '', text: '' })

const typeLabel = computed(() => destination.value ? labelMaps.type[destination.value.type] : '')
const budgetLabel = computed(() => destination.value ? labelMaps.budget[destination.value.budget] : '')
const mapSrc = computed(() => destination.value
  ? `https://maps.google.com/maps?q=${encodeURIComponent(destination.value.mapQuery)}&t=&z=10&ie=UTF8&iwloc=&output=embed`
  : '')

async function loadDestination() {
  isResolving.value = true
  try {
    destination.value = await getDestination(destinationId.value)
  } finally {
    isResolving.value = false
  }
}

async function saveFavorite() {
  if (!isAuthenticated.value) {
    showToast('Сначала войдите, чтобы сохранять направления', 'info')
    return
  }
  try {
    await add(destination.value.id)
    showToast('Направление добавлено в избранное', 'success')
  } catch {
    showToast('Не удалось добавить в избранное', 'error')
  }
}

function openAddToRoute() {
  if (!isAuthenticated.value) {
    showToast('Войдите, чтобы добавлять направления в маршрут', 'info')
    return
  }
  existingRouteSelection.value = ''
  showNewRouteFields.value = false
  newRouteForm.value = { name: '', duration: '', budget: '' }
  isAddRouteOpen.value = true
}

async function submitAddToRoute() {
  if (!destination.value) return
  try {
    if (existingRouteSelection.value) {
      const target = routes.value.find((item) => item.id === existingRouteSelection.value)
      if (target) await attachDestination(target.id, destination.value)
      showToast('Направление добавлено в существующий маршрут', 'success')
    } else {
      const { name, duration, budget } = newRouteForm.value
      if (!name.trim() || !duration.trim() || !budget) {
        showToast('Выберите маршрут или заполните поля нового маршрута', 'error')
        return
      }
      await addRoute({
        name: name.trim(),
        duration: duration.trim(),
        budget,
        destinationId: destination.value.id,
        description: `Маршрут для поездки в ${destination.value.name}. ${destination.value.shortDescription}`
      })
      showToast('Новый маршрут создан', 'success')
    }
    isAddRouteOpen.value = false
  } catch {
    showToast('Не удалось сохранить маршрут', 'error')
  }
}

async function submitReview() {
  const { name, rating, text } = reviewForm.value
  if (!name.trim() || !rating || !text.trim()) {
    showToast('Заполните все поля отзыва', 'error')
    return
  }
  try {
    await addReview({ name: name.trim(), rating, text: text.trim() })
    reviewForm.value = { name: '', rating: '', text: '' }
    showToast('Отзыв добавлен', 'success')
  } catch {
    showToast('Не удалось сохранить отзыв', 'error')
  }
}

async function shareLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showToast('Ссылка скопирована', 'success')
  } catch {
    showToast('Скопируйте адрес страницы вручную', 'info')
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value))
}

onMounted(async () => {
  await loadDestinations()
  await loadDestination()
  if (isAuthenticated.value) {
    await Promise.all([loadFavorites(), loadRoutes()])
  }
})

watch(() => route.params.id, async () => {
  await loadDestination()
})
</script>

<template>
  <div id="destinationDetailsPage">
    <div v-if="isResolving" class="container py-5">
      <div class="empty-state">
        <i class="bi bi-arrow-repeat" />
        <h2 class="h4">Загружаем направление…</h2>
      </div>
    </div>

    <div v-else-if="!destination" class="container py-5">
      <div class="empty-state">
        <i class="bi bi-exclamation-circle" />
        <h1 class="h2">Направление не найдено</h1>
        <p class="text-secondary">Параметр <code>id</code> отсутствует или не соответствует данным каталога.</p>
        <RouterLink class="btn btn-primary" to="/destinations">Вернуться в каталог</RouterLink>
      </div>
    </div>

    <div v-else>
      <section class="detail-hero">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-lg-6">
              <img class="destination-hero-image detail-hero-image" :src="destination.image" :alt="destination.name" />
            </div>
            <div class="col-lg-6">
              <span class="section-badge"><i class="bi bi-geo-alt" /> Детальная страница направления</span>
              <h1 class="section-title-sm mb-3">{{ destination.name }}</h1>
              <p class="section-text mb-3">{{ destination.description }}</p>
              <div class="card-meta">
                <span class="badge badge-soft">{{ typeLabel }}</span>
                <span class="badge badge-budget">{{ budgetLabel }}</span>
                <span class="badge badge-soft">{{ destination.duration }} дн.</span>
                <span class="badge badge-soft">Рейтинг: <span>{{ destination.rating.toFixed(1) }}</span></span>
              </div>
              <div class="d-flex flex-wrap gap-2 mt-4">
                <button
                  class="btn btn-primary"
                  type="button"
                  :disabled="isFavorite(destination.id)"
                  @click="saveFavorite"
                >
                  {{ isFavorite(destination.id) ? 'Уже в избранном' : 'Сохранить в избранное' }}
                </button>
                <button class="btn btn-outline-primary" type="button" @click="openAddToRoute">Добавить в маршрут</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-8">
              <article class="dashboard-card detail-section">
                <h2 class="h3 mb-3">Главные достопримечательности</h2>
                <ul class="list-check">
                  <li v-for="item in destination.highlights" :key="item">
                    <i class="bi bi-check-circle-fill" /><span>{{ item }}</span>
                  </li>
                </ul>
              </article>
              <article class="dashboard-card detail-section">
                <h2 class="h3 mb-3">Рекомендации для туриста</h2>
                <ul class="list-check">
                  <li v-for="tip in destination.tips" :key="tip">
                    <i class="bi bi-compass-fill" /><span>{{ tip }}</span>
                  </li>
                </ul>
              </article>
              <article class="dashboard-card detail-section">
                <h2 class="h3 mb-3">Примерный план поездки по дням</h2>
                <div class="accordion" id="itineraryAccordion">
                  <div
                    v-for="(step, index) in destination.itinerary"
                    :key="step.day"
                    class="accordion-item"
                  >
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button"
                        :class="{ collapsed: activeAccordion !== index }"
                        type="button"
                        :aria-expanded="activeAccordion === index"
                        @click="activeAccordion = activeAccordion === index ? -1 : index"
                      >
                        День {{ step.day }}: {{ step.title }}
                      </button>
                    </h2>
                    <div
                      class="accordion-collapse collapse"
                      :class="{ show: activeAccordion === index }"
                    >
                      <div class="accordion-body">{{ step.text }}</div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div class="col-lg-4">
              <article class="detail-side-card mb-4">
                <h2 class="h4 mb-3">Краткая информация</h2>
                <p class="mb-2"><strong>Локация:</strong> {{ destination.location }}</p>
                <p class="mb-2"><strong>Лучший сезон:</strong> {{ destination.bestSeason }}</p>
                <p class="mb-0"><strong>Погода:</strong> {{ destination.weather }}</p>
              </article>
              <article class="detail-side-card mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2 class="h4 mb-0">Карта</h2>
                  <span class="badge badge-soft">Карта направления</span>
                </div>
                <iframe :src="mapSrc" loading="lazy" title="Карта направления" />
              </article>
              <article class="detail-side-card mb-4">
                <h2 class="h4 mb-3">Погода</h2>
                <p class="text-secondary mb-0">{{ destination.weather }}</p>
              </article>
              <article class="detail-side-card">
                <h2 class="h4 mb-3">Поделиться поездкой</h2>
                <p class="text-secondary">Скопируйте ссылку на страницу и отправьте её друзьям для обсуждения маршрута.</p>
                <button class="btn btn-outline-primary w-100" type="button" @click="shareLink">Поделиться</button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-7">
              <div class="dashboard-card">
                <h2 class="h3 mb-4">Отзывы путешественников</h2>
                <div v-if="reviews.length">
                  <article v-for="review in reviews" :key="review.id" class="review-card mb-3">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <div>
                        <h3 class="h5 mb-1">{{ review.name }}</h3>
                        <p class="text-secondary mb-0">{{ formatDate(review.date) }}</p>
                      </div>
                      <div class="review-rating">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</div>
                    </div>
                    <p class="mb-0">{{ review.text }}</p>
                  </article>
                </div>
                <div v-else class="empty-state">
                  <i class="bi bi-chat-square-quote" />
                  <h3 class="h4">Отзывов пока нет</h3>
                  <p class="text-secondary mb-0">Будьте первым — поделитесь впечатлением о поездке.</p>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="dashboard-card">
                <h2 class="h3 mb-3">Добавить отзыв</h2>
                <form @submit.prevent="submitReview">
                  <div class="mb-3">
                    <label class="form-label" for="reviewAuthor">Имя</label>
                    <input id="reviewAuthor" v-model="reviewForm.name" class="form-control" type="text" placeholder="Ваше имя" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="reviewRating">Оценка</label>
                    <select id="reviewRating" v-model="reviewForm.rating" class="form-select">
                      <option value="">Выберите оценку</option>
                      <option value="5">5</option>
                      <option value="4">4</option>
                      <option value="3">3</option>
                      <option value="2">2</option>
                      <option value="1">1</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="reviewText">Текст отзыва</label>
                    <textarea id="reviewText" v-model="reviewForm.text" class="form-control" placeholder="Что понравилось и что стоит учесть" />
                  </div>
                  <button class="btn btn-primary w-100" type="submit">Опубликовать отзыв</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="isAddRouteOpen" class="modal-backdrop-custom" @click.self="isAddRouteOpen = false">
      <div class="modal-dialog-custom">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Добавить в маршрут</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="isAddRouteOpen = false" />
        </div>
        <form @submit.prevent="submitAddToRoute">
          <div class="mb-3">
            <label class="form-label" for="existingRoute">Существующий маршрут</label>
            <select id="existingRoute" v-model="existingRouteSelection" class="form-select">
              <option value="">Создать новый маршрут</option>
              <option v-for="r in routes" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </div>
          <button
            class="btn btn-outline-primary w-100 mb-3"
            type="button"
            @click="showNewRouteFields = !showNewRouteFields"
          >
            Или создать новый маршрут
          </button>
          <div v-if="showNewRouteFields">
            <div class="mb-3">
              <label class="form-label" for="newRouteName">Название маршрута</label>
              <input id="newRouteName" v-model="newRouteForm.name" class="form-control" type="text" placeholder="Весенний маршрут" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="newRouteDuration">Длительность</label>
              <input id="newRouteDuration" v-model="newRouteForm.duration" class="form-control" type="text" placeholder="5 дней" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="newRouteBudget">Бюджет</label>
              <select id="newRouteBudget" v-model="newRouteForm.budget" class="form-select">
                <option value="">Выберите бюджет</option>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary w-100" type="submit">Сохранить в маршрут</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}
.modal-dialog-custom {
  background: var(--tp-surface, #fff);
  color: var(--tp-text, #0f172a);
  border-radius: var(--tp-radius-md, 1rem);
  padding: 1.5rem;
  width: min(540px, 100%);
  box-shadow: var(--tp-shadow, 0 30px 60px rgba(15, 23, 42, 0.25));
}
</style>
