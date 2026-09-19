<script setup>
import { useFormatters } from "../composables/useFormatters";

defineProps({
  destination: {
    type: Object,
    required: true
  }
});

const { formatPrice, formatDays } = useFormatters();
</script>

<template>
  <article class="destination-card h-100">
    <div :class="['destination-cover', destination.coverClass]">
      <span aria-hidden="true">{{ destination.emoji }}</span>
      <small>{{ destination.typeLabel }}</small>
    </div>
    <div class="destination-body">
      <p class="destination-days">{{ formatDays(destination.days) }} · {{ destination.season }}</p>
      <h2 class="h4">{{ destination.name }}</h2>
      <p class="destination-description">{{ destination.description }}</p>
      <div class="d-flex justify-content-between align-items-center gap-3 mt-auto">
        <strong>от {{ formatPrice(destination.price) }}</strong>
        <RouterLink class="btn btn-primary btn-sm" :to="`/destination/${destination.id}`">
          Подробнее
        </RouterLink>
      </div>
    </div>
  </article>
</template>
