<script setup>
import { RouterLink } from "vue-router";
import { formatCurrency, formatDate, getBadgeClassByType, shortText } from "../../utils/formatters";

defineProps({
  event: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <article class="card h-100" :aria-labelledby="`event-card-title-${event.id}`">
    <img :src="event.image" class="card-img-top event-card-image" :alt="event.title">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
        <span class="badge" :class="getBadgeClassByType(event.type)">{{ event.typeLabel }}</span>
        <span class="event-meta">{{ formatDate(event.dateTime) }}</span>
      </div>
      <h2 :id="`event-card-title-${event.id}`" class="h5">{{ event.title }}</h2>
      <p class="text-secondary mb-2">{{ event.cityLabel }}, {{ event.venue }}</p>
      <p class="small text-secondary mb-2 event-meta-inline">
        <span>От {{ formatCurrency(event.price) }}</span>
        <span>Свободно мест: {{ event.seatsAvailable }}</span>
      </p>
      <p class="small text-secondary">{{ shortText(event.description, 110) }}</p>
      <RouterLink class="btn btn-outline-primary mt-auto" :to="{ name: 'event-details', params: { id: event.id } }">
        Подробнее
      </RouterLink>
    </div>
  </article>
</template>
