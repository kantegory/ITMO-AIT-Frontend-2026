<template>
  <article class="card shadow-sm h-100">
    <section class="card-body">
      <header class="d-flex justify-content-between align-items-start">
        <section>
          <h2 class="h6 mb-1">
            <SvgIcon name="icon-return" size="sm" class="me-2"/>
            {{ eventName || 'Билет #' + ticketId }}
          </h2>
          <p class="text-muted small mb-1">
            <SvgIcon name="icon-seats" size="sm" class="me-1"/>
            Места: {{ seats || 'Не указано' }}
          </p>
          <p class="text-muted small mb-1">Сумма: {{ formatPrice(amount) }} ₽</p>
          <p class="text-muted small mb-0">Заказ #{{ ticketId }}</p>
        </section>
        <footer class="text-end">
          <span :class="['badge', 'mb-2', statusBadge]">{{ statusText }}</span>
          <p class="text-muted small mb-0">
            <SvgIcon name="icon-calendar" size="sm" class="me-1"/>
            Запрос от: {{ formatDate(requestDate) }}
          </p>
        </footer>
      </header>
    </section>
  </article>
</template>

<script>
import { useFormat } from '@/composables/useFormat'
import SvgIcon from './icons/SvgIcon.vue'

export default {
  name: 'ReturnCard',
  components: { SvgIcon },
  props: {
    eventName: { type: String, default: '' },
    seats: { type: String, default: '' },
    amount: { type: Number, required: true },
    ticketId: { type: Number, required: true },
    status: { type: String, required: true },
    requestDate: { type: String, required: true }
  },
  computed: {
    statusBadge() {
      if (this.status === 'processing') return 'bg-warning text-dark'
      if (this.status === 'completed') return 'bg-success'
      if (this.status === 'rejected') return 'bg-danger'
      return ''
    },
    statusText() {
      if (this.status === 'processing') return 'В обработке'
      if (this.status === 'completed') return 'Возвращено'
      if (this.status === 'rejected') return 'Отклонено'
      return ''
    }
  },
  setup() {
    const { formatDate, formatPrice } = useFormat()
    return { formatDate, formatPrice }
  }
}
</script>
