<template>
  <div class="card destination-card">
    <div class="destination-img" :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('${destination.image}')` }">
      <span class="destination-badge">
        <svg class="icon"><use :xlink:href="`/sprite.svg#${typeIcon}`"></use></svg>
        {{ destination.type }}
      </span>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h3 class="h5 card-title mb-0">{{ destination.name }}</h3>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-light text-dark">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg>
          {{ destination.duration }}
        </span>
        <span class="rating-stars" :aria-label="`Рейтинг: ${destination.rating} из 5`">
          <template v-for="i in 5" :key="i">
            <svg class="icon" v-if="i <= fullStars"><use xlink:href="/sprite.svg#icon-star-fill"></use></svg>
            <svg class="icon" v-else-if="i === fullStars + 1 && hasHalf"><use xlink:href="/sprite.svg#icon-star-half"></use></svg>
            <svg class="icon" v-else><use xlink:href="/sprite.svg#icon-star"></use></svg>
          </template>
          <span class="text-muted">{{ destination.rating }}</span>
        </span>
      </div>
      <p class="card-text text-muted small mb-2">{{ truncatedDescription }}</p>
      <div class="mb-2 small">
        <span v-for="tag in destination.tags" :key="tag" class="badge bg-light text-dark me-1">#{{ tag }}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <span class="price-tag">{{ destination.price }}</span>
        <RouterLink :to="`/destination/${destination.id}`" class="btn btn-sm btn-outline-success">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-eye"></use></svg>
          Смотреть
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  destination: {
    type: Object,
    required: true
  }
})

const typeIcon = computed(() => {
  const icons = {
    'Город': 'icon-building',
    'Природа': 'icon-tree',
    'Смешанный': 'icon-arrow-repeat'
  }
  return icons[props.destination.type] || 'icon-geo-alt'
})

const fullStars = computed(() => Math.floor(props.destination.rating))
const hasHalf = computed(() => props.destination.rating % 1 >= 0.5)

const truncatedDescription = computed(() => {
  if (props.destination.description && props.destination.description.length > 150) {
    return props.destination.description.substring(0, 150) + '…'
  }
  return props.destination.description
})
</script>