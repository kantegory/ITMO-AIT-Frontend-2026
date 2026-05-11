<template>
  <div class="col-12 col-md-6">
    <article class="card card-event h-100">
      <div class="card-body d-flex flex-column">
        <h2 class="h6 card-title mb-1">{{ event.title }}</h2>
        <p class="small text-secondary mb-1">{{ cityLabel(event.city) }} · {{ event.date }}</p>
        <p class="small text-secondary mb-2">{{ event.venue }}</p>
        <p class="mb-2 small flex-grow-1">{{ event.description }}</p>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="fw-semibold">{{ event.priceFrom }} ₽</span>
          <RouterLink
            class="btn btn-sm btn-outline-primary"
            :to="{ name: 'event', params: { id: String(event.id) } }"
            :aria-label="'Подробнее о мероприятии: ' + (event.title || '')"
          >
            Подробнее
          </RouterLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { useCity } from '@/composables/useCity'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const { cityLabel } = useCity()
</script>
