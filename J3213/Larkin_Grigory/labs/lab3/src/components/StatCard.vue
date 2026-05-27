<script setup>
defineProps({
  label: String,
  value: String,
  valueClass: String
})
</script>

<template>
  <div class="card p-3">
    <div class="text-muted small mb-1">{{ label }}</div>
    <div class="fs-5 fw-bold" :class="valueClass">{{ value }}</div>
  </div>
</template>
