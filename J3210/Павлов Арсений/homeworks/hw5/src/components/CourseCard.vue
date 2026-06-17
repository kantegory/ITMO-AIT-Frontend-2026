<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <article class="card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <small>Уроков: {{ lessons }}</small>
  </article>
</template>
