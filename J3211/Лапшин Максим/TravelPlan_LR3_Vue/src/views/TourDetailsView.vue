<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getTourById } from '@/services/api'
import { useFavorites } from '@/composables/useFavorites'

const route = useRoute()
const tour = ref(null)
const loading = ref(true)
const error = ref('')
const { isFavorite, toggleFavorite } = useFavorites()

onMounted(async () => {
  try {
    tour.value = await getTourById(route.params.id)
  } catch {
    error.value = 'Тур не найден или API недоступен.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
  <article v-else class="card tour-details overflow-hidden">
    <img class="tour-details-image" :src="tour.image" :alt="tour.title">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div>
          <RouterLink :to="{ name: 'home' }" class="small text-decoration-none">← Все туры</RouterLink>
          <h1 class="mt-2">{{ tour.title }}</h1>
        </div>
        <button class="btn btn-outline-danger" type="button" @click="toggleFavorite(tour.id)">
          {{ isFavorite(tour.id) ? '♥ Сохранено' : '♡ Сохранить' }}
        </button>
      </div>
      <p class="lead mt-3">{{ tour.description }}</p>
      <div class="row g-3 mt-3">
        <div class="col-md-4"><div class="detail-value">${{ tour.price }}</div><div class="text-muted">стоимость</div></div>
        <div class="col-md-4"><div class="detail-value">{{ tour.duration }} дней</div><div class="text-muted">длительность</div></div>
        <div class="col-md-4"><div class="detail-value">★ {{ tour.rating }}</div><div class="text-muted">рейтинг</div></div>
      </div>
    </div>
  </article>
</template>
