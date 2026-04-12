<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <article class="card">
    <h2 class="card__title">{{ title }}</h2>
    <p class="card__country">{{ country }}</p>
    <p class="card__text">{{ description }}</p>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card__title {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.card__country {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: #0369a1;
  font-weight: 500;
}

.card__text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #475569;
}
</style>