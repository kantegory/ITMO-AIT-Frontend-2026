<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="card stat-card h-100">
    <div class="card-body">
      <p class="stat-card-label text-muted mb-1">{{ label }}</p>
      <p class="stat-card-value mb-0"><slot /></p>
    </div>
  </div>
</template>

<style scoped>
.stat-card-value {
  font-size: 2rem;
  font-weight: 600;
}
</style>
