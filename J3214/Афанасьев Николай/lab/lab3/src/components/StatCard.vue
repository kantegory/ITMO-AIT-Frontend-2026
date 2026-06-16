<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  sub:   { type: String, default: '' },
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="sub" class="stat-sub">{{ sub }}</div>
  </div>
</template>
