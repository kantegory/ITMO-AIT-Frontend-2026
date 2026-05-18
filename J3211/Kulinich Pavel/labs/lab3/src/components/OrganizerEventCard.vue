<script setup>
defineProps({
  event: { type: Object, required: true }
});
</script>

<template>
  <div class="organizer-event-card h-100">
    <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
      <h5 class="fw-bold mb-0">{{ event.title }}</h5>
      <span class="badge text-bg-primary">{{ event.type }}</span>
    </div>
    <p class="text-secondary mb-1">Дата: {{ event.date }}</p>
    <p class="text-secondary mb-0">Город: {{ event.location }}</p>
  </div>
</template>
