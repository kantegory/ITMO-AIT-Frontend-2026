<template>
  <div class="text-center py-5 text-muted">
    <div class="mb-2" style="font-size: 2rem;">📭</div>
    <div class="fw-semibold">{{ title }}</div>
    <div v-if="subtitle" class="small mt-1">{{ subtitle }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Ничего не найдено' },
  subtitle: { type: String, default: '' }
})
</script>