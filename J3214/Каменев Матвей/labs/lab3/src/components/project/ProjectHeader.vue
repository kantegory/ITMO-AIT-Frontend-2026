<script setup>
import PriceLabel from '@/components/common/PriceLabel.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  spentRub: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <section class="project-header border-bottom py-4">
    <div class="container">
      <img :src="cover" alt="" class="project-cover mb-4" />
      <h1 class="h3 mb-2">{{ title }}</h1>
      <p class="text-muted mb-3">{{ description }}</p>
      <p class="mb-0">
        <span class="text-muted">Потраченный бюджет:</span>
        {{ ' ' }}
        <price-label class="fw-semibold" :rub="spentRub" />
      </p>
    </div>
  </section>
</template>

<style scoped>
.project-cover {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: var(--bs-border-radius);
}
</style>
