<template>
  <section class="page-header d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between mb-4">
    <div>
      <p class="page-kicker mb-2">{{ kicker }}</p>
      <h1 class="h2 mb-2">{{ title }}</h1>
      <p v-if="description" class="text-secondary mb-0">{{ description }}</p>
    </div>
    <div class="d-flex flex-wrap gap-2">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  kicker: {
    type: String,
    default: 'Раздел'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
