<template>
  <div class="card border-0 shadow-sm p-3 mb-3">
    <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
      <div v-if="event">
        <h5 class="mb-1 section-title-with-icon">
          <base-icon name="ticket" />
          <span>{{ event.title }}</span>
        </h5>
        <p class="mb-1 text-muted">{{ typeLabel(event.type) }}</p>
        <p class="mb-1 meta-with-icon">
          <base-icon name="calendar" />
          <span>{{ event.cityLabel || event.city }} • {{ event.date }} • {{ event.place }}</span>
        </p>
        <p class="mb-0 text-muted">Номер билета: {{ ticket.id }}</p>
      </div>
      <div v-else>
        <h5 class="mb-1 section-title-with-icon">
          <base-icon name="ticket" />
          <span>Мероприятие недоступно</span>
        </h5>
        <p class="mb-0 text-muted">
          Билет #{{ ticket.id }} остался в истории, но само мероприятие уже удалено.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-danger btn-icon"
        :aria-label="`Вернуть билет ${ticket.id}`"
        @click="$emit('refund', ticket.id)"
      >
        <base-icon name="trash" />
        <span>Вернуть билет</span>
      </button>
    </div>
  </div>
</template>

<script>

import useEventTypes from '@/composables/useEventTypes'
import BaseIcon from '@/components/BaseIcon.vue'

export default {
  name: 'TicketCard',
  components: { BaseIcon },
  props: {
    ticket: { type: Object, required: true },
    event: { type: Object, default: null }
  },
  emits: ['refund'],
  setup() {
    const { typeLabel } = useEventTypes()
    return { typeLabel }
  }
}

</script>
