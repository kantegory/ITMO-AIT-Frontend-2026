<script setup>
defineProps({
  destination: {
    type: Object,
    required: true
  }
});

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}
</script>

<template>
  <article class="destination-card">
    <div class="destination-icon" aria-hidden="true">{{ destination.emoji }}</div>
    <div>
      <p class="destination-days">{{ destination.days }} дня</p>
      <h3>{{ destination.name }}</h3>
      <p>{{ destination.description }}</p>
      <strong>от {{ formatPrice(destination.price) }}</strong>
    </div>
  </article>
</template>
