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
  <p v-else class="empty-message">Ничего не найдено. Попробуйте изменить запрос.</p>
</template>
