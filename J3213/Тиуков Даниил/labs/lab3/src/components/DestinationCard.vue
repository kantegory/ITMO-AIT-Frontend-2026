<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { labelMaps } from '@/composables/useDestinations.js'

const props = defineProps({
  destination: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false }
})

defineEmits(['save'])

const typeClass = computed(() => (props.destination.type === 'city' ? 'badge-city' : 'badge-nature'))
const typeLabel = computed(() => labelMaps.type[props.destination.type])
const budgetLabel = computed(() => labelMaps.budget[props.destination.budget])
</script>

<template>
  <article class="destination-card card border-0">
    <img :src="destination.image" class="card-img-top" :alt="destination.name" />
    <div class="card-body d-flex flex-column">
      <div class="card-meta mt-0">
        <span class="badge" :class="typeClass">{{ typeLabel }}</span>
        <span class="badge badge-budget">{{ budgetLabel }}</span>
        <span class="badge badge-soft">{{ destination.duration }} дн.</span>
      </div>
      <div class="d-flex justify-content-between align-items-start gap-3">
        <h3 class="h4 mb-2">{{ destination.name }}</h3>
        <span class="text-warning fw-bold">{{ destination.rating.toFixed(1) }} <i class="bi bi-star-fill" /></span>
      </div>
      <p class="text-secondary flex-grow-1">{{ destination.shortDescription }}</p>
      <div class="d-flex flex-wrap gap-2 mt-3">
        <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'destination-details', params: { id: destination.id } }">Подробнее</RouterLink>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          :disabled="isFavorite"
          @click="$emit('save', destination.id)"
        >
          {{ isFavorite ? 'Сохранено' : 'Сохранить' }}
        </button>
      </div>
    </div>
  </article>
</template>
