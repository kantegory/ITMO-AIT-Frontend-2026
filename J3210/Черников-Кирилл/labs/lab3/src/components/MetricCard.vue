<template>
  <article class="metric-card p-4 h-100">
    <p class="text-secondary mb-1">{{ label }}</p>
    <h2 class="display-6 fw-bold mb-0" aria-live="polite">{{ value ?? '-' }}</h2>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: null },
})
</script>
