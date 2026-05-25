<script setup>
defineProps({
  ticket: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['refund'])
</script>

<template>
  <article class="ticket-item h-100">
    <p class="small text-secondary mb-2">{{ ticket.category }} | {{ ticket.date }} | {{ ticket.city }}</p>
    <h3 class="h5 mb-2">{{ ticket.eventName }}</h3>
    <p class="mb-3 small">{{ ticket.seat }} | Заказ #{{ ticket.id }}</p>
    <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
      <span class="badge text-bg-success">Оплачен</span>
      <button v-if="ticket.canRefund" class="btn btn-sm btn-outline-danger" type="button" @click="emit('refund', ticket)">
        Оформить возврат
      </button>
      <button v-else class="btn btn-sm btn-outline-secondary" type="button" disabled>Заявка отправлена</button>
    </div>
  </article>
</template>
