<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'primary',
  },
});
</script>

<template>
  <div class="card stat-card h-100" :class="`stat-card-${tone}`" role="status">
    <div class="card-body">
      <div class="stat-value">{{ value }}</div>
      <p class="card-text mb-0">{{ label }}</p>
    </div>
  </div>
</template>
