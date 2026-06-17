<template>
  <div class="col-12 col-md-6 col-xl-4">
    <router-link :to="`/event/${event.id}`" class="event-card-link">
      <article class="event-card-custom">
        <div class="event-card-image-wrap">
          <img :src="`/${event.image || 'img/carousel1.webp'}`" :alt="event.title" class="event-card-image">
          <span class="badge text-bg-light border rounded-pill goal-badge position-absolute top-0 start-0 m-3">
            {{ getGoalLabel(event.goal) }}
          </span>
        </div>
        <div class="event-card-body">
          <h3 class="event-card-title">{{ event.title }}</h3>
          <p class="event-card-text">{{ event.description }}</p>
          <div class="event-card-meta">
            <span class="event-meta-pill">{{ getPlaceLabel(event.place) }}</span>
            <span class="event-meta-pill">{{ formatDate(event.date) }}</span>
          </div>
        </div>
      </article>
    </router-link>
  </div>
</template>

<script>
import { useFormatters } from '@/composables/useFormatters'

export default {
  name: 'EventCard',
  props: {
    event: { type: Object, required: true }
  },
  setup() {
    return useFormatters()
  }
}
</script>