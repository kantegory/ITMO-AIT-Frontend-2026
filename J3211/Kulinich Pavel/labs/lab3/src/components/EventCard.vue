<script setup>
defineProps({
  event: { type: Object, required: true }
});
</script>

<template>
  <div class="card event-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
    <img :src="event.image" :alt="event.title">
    <div class="card-body d-flex flex-column p-4">
      <div class="d-flex gap-2 flex-wrap mb-2">
        <span class="badge text-bg-primary">{{ event.type }}</span>
        <span class="badge text-bg-light">{{ event.location }}</span>
      </div>
      <h5 class="fw-bold">{{ event.title }}</h5>
      <p class="text-secondary mb-2">{{ event.place }}</p>
      <p class="text-secondary">{{ event.date }} · {{ event.price }}</p>
      <router-link
        :to="{ name: 'event', params: { id: event.id } }"
        class="btn btn-outline-primary mt-auto"
      >Подробнее</router-link>
    </div>
  </div>
</template>
