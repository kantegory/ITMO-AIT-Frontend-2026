<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  centered: { type: Boolean, default: false }
});
</script>

<template>
  <article
    class="card h-100 border-0 shadow-sm rounded-4 p-4"
    :class="{ 'text-center': centered }"
  >
    <div class="feature-icon">{{ icon }}</div>
    <h5 class="fw-semibold">{{ title }}</h5>
    <p class="text-secondary mb-0">{{ description }}</p>
  </article>
</template>
