<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  emptyText: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="hub-card">
    <slot name="header">
      <h2 class="fw-bold fs-4 mb-3">{{ title }}</h2>
    </slot>

    <div v-if="items.length">
      <slot :items="items" />
    </div>
    <div v-else class="muted">{{ emptyText }}</div>
  </div>
</template>
