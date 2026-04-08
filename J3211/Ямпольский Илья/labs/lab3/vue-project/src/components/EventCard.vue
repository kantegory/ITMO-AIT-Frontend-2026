<template>
  <article class="card h-100 event-card" @click="$emit('click', event.id)" style="cursor: pointer;">
    <section class="card-body d-flex flex-column">
      <header class="flex-grow-1">
        <h2 class="card-title h5 mb-1">
          <SvgIcon name="icon-ticket" size="sm" class="me-2"/>
          {{ event.title }}
        </h2>
        <p class="card-text text-muted">
          <SvgIcon name="icon-calendar" size="sm" class="me-1"/>
          {{ formatDate(event.date) }}
          <SvgIcon name="icon-location" size="sm" class="ms-2 me-1"/>
          {{ event.city }}{{ event.venue ? ', ' + event.venue : '' }}
        </p>
      </header>
      <footer class="mt-auto">
        <span class="badge bg-success">
          <SvgIcon name="icon-star" size="sm" class="me-1"/>
          от {{ formatPrice(event.price) }} ₽
        </span>
      </footer>
    </section>
  </article>
</template>

<script>
import { useFormat } from '@/composables/useFormat'
import SvgIcon from './icons/SvgIcon.vue'

export default {
  name: 'EventCard',
  components: { SvgIcon },
  props: {
    event: { type: Object, required: true }
  },
  emits: ['click'],
  setup() {
    const { formatDate, formatPrice } = useFormat()
    return { formatDate, formatPrice }
  }
}
</script>
