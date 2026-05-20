<script setup lang="ts">
defineProps<{
  title: string
  text: string
  icon: string
}>()
</script>

<template>
  <article class="feature-card">
    <div class="feature-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </article>
</template>