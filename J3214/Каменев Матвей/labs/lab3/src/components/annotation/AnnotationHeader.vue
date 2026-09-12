<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="annotation-header border-bottom">
    <div class="container py-3">
      <h1 class="h5 mb-1">{{ title }}</h1>
      <p class="annotation-header-desc text-muted mb-0">{{ description }}</p>
    </div>
  </header>
</template>

<style scoped>
.annotation-header {
  position: sticky;
  top: 0;
  z-index: 1020;
  background: var(--bs-body-bg);
}

.annotation-header-desc {
  font-size: 0.875rem;
}
</style>
