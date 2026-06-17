<script setup>
defineProps({
  title: String,
  text: String,
})
</script>

<template>
  <li class="note">
    <div class="note__title">{{ title }}</div>
    <div class="note__text">{{ text }}</div>
  </li>
</template>

<style scoped>
.note {
  list-style: none;
  border: 1px solid #ccc;
  padding: 0.5rem 0.75rem;
  margin: 0 0 0.5rem;
}

.note__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.note__text {
  white-space: pre-wrap;
  font-size: 0.95rem;
}
</style>
