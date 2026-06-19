<script setup>
import { computed } from 'vue';

const props = defineProps({
  ticket: { type: Object, required: true }
});

const badgeClass = computed(() =>
  props.ticket.status === 'Возврат оформлен' ? 'text-bg-secondary' : 'text-bg-success'
);
</script>

<template>
  <div class="ticket-card h-100">
    <h5 class="fw-bold mb-2">{{ ticket.title }}</h5>
    <p class="mb-1 text-secondary">Дата: {{ ticket.date }}</p>
    <p class="mb-1 text-secondary">Город: {{ ticket.location }}</p>
    <p class="mb-3">
      <span class="badge" :class="badgeClass">{{ ticket.status }}</span>
    </p>
  </div>
</template>
