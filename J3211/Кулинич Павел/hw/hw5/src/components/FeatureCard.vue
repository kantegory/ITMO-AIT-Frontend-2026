<template>
  <article class="card">
    <div class="card-icon">{{ icon }}</div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-text">{{ text }}</p>
  </article>
</template>

<script setup>
defineProps({
  title: String,
  text: String,
  icon: String
})
</script>