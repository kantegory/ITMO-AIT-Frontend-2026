<template>
  <div v-if="loading" class="loading-spinner">
    <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
    <span>Загрузка...</span>
  </div>
  <div v-else-if="error" class="error-box">
    <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
  </div>
  <div v-else-if="empty" class="empty-box">
    <i class="bi bi-inbox fs-1 d-block mb-2 opacity-40"></i>
    {{ emptyText }}
  </div>
  <slot v-else />
</template>

<script setup>
defineProps({
  loading: Boolean,
  error: String,
  empty: Boolean,
  emptyText: { type: String, default: 'Ничего не найдено' }
})
</script>
