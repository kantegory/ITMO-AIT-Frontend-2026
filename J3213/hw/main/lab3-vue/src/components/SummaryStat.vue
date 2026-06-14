<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  delta: { type: String, default: '' },
  deltaClass: { type: String, default: '' },
})
</script>

<template>
  <article class="stat-card h-100">
    <p class="muted mb-2">{{ title }}</p>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-delta" :class="deltaClass">{{ delta }}</div>
  </article>
</template>
