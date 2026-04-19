<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="card shadow-sm border-0 h-100 stats-card">
    <div class="card-body">
      <p class="stats-label mb-2">{{ title }}</p>
      <h3 class="stats-value mb-2">{{ value }}</h3>
      <p class="text-muted mb-0">{{ description }}</p>
    </div>
  </div>
</template>