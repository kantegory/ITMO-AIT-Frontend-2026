<script setup>
import DestinationCard from "./DestinationCard.vue";

defineProps({
  destinations: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div v-if="destinations.length" class="destination-grid">
    <DestinationCard
      v-for="destination in destinations"
      :key="destination.id"
      :destination="destination"
    />
  </div>
  <div v-else class="empty-message">
    <h2 class="h5">Ничего не найдено</h2>
    <p class="mb-0">Измените параметры поиска или сбросьте фильтры.</p>
  </div>
</template>
