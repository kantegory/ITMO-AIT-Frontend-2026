<template>
  <div class="col-md-4 mb-4">
    
    <article class="card h-100 event-list-card" :aria-labelledby="`event-title-${event.id}`">
      
      <event-image
        :src="event.image"
        :alt="event.title"
        image-class="card-img-top"
      />
      <div class="card-body d-flex flex-column">
        <span class="badge text-bg-light align-self-start mb-2" :aria-label="`Тип мероприятия: ${typeLabel(event.type)}`">
          {{ typeLabel(event.type) }}
        </span>
        <h5 :id="`event-title-${event.id}`" class="card-title">{{ event.title }}</h5>
        <p class="text-muted mb-3 meta-with-icon" aria-label="Город и дата">
          <base-icon name="calendar" />
          <span>{{ event.cityLabel || event.city }} • {{ event.date }}</span>
        </p>
        <router-link
          :to="{ name: 'event', params: { id: event.id } }"
          class="btn btn-primary mt-auto btn-icon"
          :aria-label="`Подробнее о мероприятии ${event.title}`"
        >
          <base-icon name="ticket" />
          <span>Подробнее</span>
        </router-link>
      </div>
    </article>
  </div>
</template>

<script>

import useEventTypes from '@/composables/useEventTypes'
import EventImage from '@/components/EventImage.vue'
import BaseIcon from '@/components/BaseIcon.vue'

export default {
  name: 'EventCard',
  components: { EventImage, BaseIcon },
  props: {
    event: { type: Object, required: true }
  },
  setup() {
    const { typeLabel } = useEventTypes()
    return { typeLabel }
  }
}

</script>
