<template>
  <article class="card shadow-sm ticket-item h-100">
    <section class="card-body">
      <header class="d-flex justify-content-between">
        <h2 class="h5 mb-1">
          <SvgIcon name="icon-ticket" size="sm" class="me-2"/>
          {{ ticket.eventName || 'Билет #' + ticket.id }}
        </h2>
        <span class="badge bg-success">{{ formatPrice(ticket.totalPrice) }} ₽</span>
      </header>
      <p class="text-muted mb-1">
        <SvgIcon name="icon-seats" size="sm" class="me-1"/>
        Места: {{ ticket.seats }}
      </p>
      <p class="text-muted mb-1">
        <SvgIcon name="icon-calendar" size="sm" class="me-1"/>
        Дата покупки: {{ formatDate(ticket.purchaseDate) }}
      </p>
      <footer class="d-flex justify-content-between align-items-center mt-2">
        <small class="text-muted">Заказ #{{ ticket.id }}</small>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('return', ticket.id, ticket.totalPrice)">
          <SvgIcon name="icon-return" size="sm" class="me-1"/>
          Вернуть
        </button>
      </footer>
    </section>
  </article>
</template>

<script>
import { useFormat } from '@/composables/useFormat'
import SvgIcon from './icons/SvgIcon.vue'

export default {
  name: 'TicketCard',
  components: { SvgIcon },
  props: {
    ticket: { type: Object, required: true }
  },
  emits: ['return'],
  setup() {
    const { formatDate, formatPrice } = useFormat()
    return { formatDate, formatPrice }
  }
}
</script>
