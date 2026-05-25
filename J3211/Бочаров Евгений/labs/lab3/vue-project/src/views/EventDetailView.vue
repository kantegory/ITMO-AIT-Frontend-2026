<template>
  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2">Загрузка...</p>
  </div>

  <div v-else-if="eventError" class="alert alert-danger">{{ eventError }}</div>

  <template v-else-if="event">
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-item">Главная</router-link>
      <span class="breadcrumb-item active">{{ event.title }}</span>
    </nav>

    <div class="row">
      <div class="col-lg-8">
        <img :src="event.poster" class="card-img-top rounded-3 mb-4" style="max-height:400px;object-fit:cover" alt="poster">
        <h1 class="display-5 fw-bold">{{ event.title }}</h1>
        <p class="lead text-muted">{{ event.description }}</p>
        <span class="badge bg-secondary me-2">{{ typeLabels[event.type] || event.type }}</span>
        <span class="badge bg-primary fs-6">{{ event.ageRestriction }}</span>

        <div class="card shadow-sm border-0 p-4 mt-4">
          <ul class="nav nav-tabs">
            <li class="nav-item"><button class="nav-link" :class="{active: tab==='desc'}" @click="tab='desc'">Описание</button></li>
            <li class="nav-item"><button class="nav-link" :class="{active: tab==='venue'}" @click="tab='venue'">Место</button></li>
            <li class="nav-item"><button class="nav-link" :class="{active: tab==='reviews'}" @click="tab='reviews'">Отзывы ({{ reviews.length }})</button></li>
          </ul>
          <div class="p-3">
            <div v-if="tab==='desc'">
              <p>{{ event.longDescription || event.description }}</p>
              <p v-if="event.cast"><strong>В ролях:</strong> {{ event.cast.join(', ') }}</p>
            </div>
            <div v-if="tab==='venue'">
              <h5>{{ event.venue?.name }}</h5>
              <p>
                <Icon name="map-pin" class="text-danger" /> {{ event.venue?.address }}
              </p>
              <p v-if="event.venue?.metro">
                <Icon name="train" /> {{ event.venue?.metro }}
              </p>
              <button class="btn btn-outline-primary mt-2" @click="showHall = true">
                <Icon name="chair" /> Схема зала
              </button>
            </div>
            <div v-if="tab==='reviews'">
              <ReviewForm :eventId="event.id" @added="loadReviews(event.id)" />
              <ReviewItem v-for="r in reviews" :key="r.id" :review="r" />
              <p v-if="reviews.length===0" class="text-muted text-center py-3">Отзывов пока нет</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 sticky-top" style="top:20px">
          <div class="card-body">
            <h3>Билеты</h3>
            <select class="form-select mb-3">
              <option v-for="d in (event.dates || [])" :key="d.id" :value="d.id">
                {{ new Date(d.datetime).toLocaleString('ru-RU') }}
              </option>
            </select>
            <div class="list-group mb-3">
              <div v-for="(p, key) in event.prices" :key="key" class="list-group-item d-flex justify-content-between">
                <span>{{ p.name }}</span>
                <span class="badge bg-primary">{{ p.price }} ₽</span>
              </div>
            </div>
            <button class="btn btn-primary w-100" @click="showHall = true" :disabled="!isAuthenticated">
              <Icon name="chair" /> Выбрать места
            </button>
          </div>
        </div>
      </div>
    </div>

    <SeatScheme v-model="showHall" :event="event" />
  </template>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { EventsAPI } from '@/api/endpoints'
import { useReviews } from '@/composables/useReviews'
import { useAuth } from '@/composables/useAuth'
import ReviewForm from '@/components/reviews/ReviewForm.vue'
import ReviewItem from '@/components/reviews/ReviewItem.vue'
import SeatScheme from '@/components/ui/SeatScheme.vue'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { reviews, fetchReviews: loadReviews } = useReviews()

const event = ref(null)
const loading = ref(true)
const eventError = ref(null)
const tab = ref('desc')
const showHall = ref(false)
const typeLabels = { theater: 'Театр', concert: 'Концерт', standup: 'Стендап', festival: 'Фестиваль' }

onMounted(async () => {
  try {
    event.value = await EventsAPI.getById(route.params.id)

    try {
      await loadReviews(route.params.id)
    } catch (e) {
      console.warn('Не удалось загрузить отзывы:', e)
      reviews.value = []
    }
  } catch (e) {
    eventError.value = e.message
  } finally {
    loading.value = false
  }
})
</script>