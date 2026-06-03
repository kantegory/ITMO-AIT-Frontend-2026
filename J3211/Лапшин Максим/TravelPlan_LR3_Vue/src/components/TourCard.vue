<script setup>
import { computed } from 'vue'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps({
  tour: { type: Object, required: true },
  featured: { type: Boolean, default: false },
})
const { isFavorite, toggleFavorite } = useFavorites()
const badges = { city: 'bg-primary', nature: 'bg-success', culture: 'bg-info text-dark', beach: 'bg-warning text-dark' }
const badgeClass = computed(() => badges[props.tour.type] || 'bg-secondary')
</script>

<template>
  <article class="card h-100 shadow-sm hover-shadow tour-card">
    <img :src="tour.image" class="card-img-top" :class="{ featured: featured }" :alt="tour.title">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between gap-2">
        <h2 class="card-title h5">{{ tour.title }}</h2>
        <button class="favorite-btn" type="button" :aria-label="isFavorite(tour.id) ? 'Удалить из избранного' : 'В избранное'" @click="toggleFavorite(tour.id)">
          <svg class="bi" width="22" height="22" :class="{ 'favorite-active': isFavorite(tour.id) }"><use href="#heart" /></svg>
        </button>
      </div>
      <p class="card-text text-muted small flex-grow-1">{{ tour.description }}</p>
      <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
        <span class="badge" :class="badgeClass">{{ tour.type }}</span>
        <small class="text-muted fw-bold">${{ tour.price }} / {{ tour.duration }} дн.</small>
      </div>
      <RouterLink class="btn btn-outline-primary" :to="{ name: 'tour', params: { id: tour.id } }">Подробнее</RouterLink>
    </div>
  </article>
</template>
