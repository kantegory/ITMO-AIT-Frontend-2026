<template>
  <div class="card">
    <div class="card-body">
      <div class="small text-muted mb-1">{{ label }}</div>
      <div class="h4 mb-0 fw-bold">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true }
})
</script>