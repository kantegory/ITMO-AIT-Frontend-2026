<script setup>
import PriceLabel from '@/components/common/PriceLabel.vue'

defineProps({
  order: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="card order-card h-100">
    <img :src="order.cover" class="card-img-top order-card-cover" :alt="order.coverAlt" />
    <div class="card-body d-flex flex-column">
      <h3 class="card-title h5">{{ order.title }}</h3>
      <p class="order-card-type text-muted mb-2">
        <span>{{ order.type }}</span>
        <svg class="order-card-type-icon" aria-hidden="true"><use :href="`#${order.icon}`"></use></svg>
      </p>
      <p class="card-text flex-grow-1">{{ order.description }}</p>
      <price-label tag="p" class="order-card-price fw-semibold mb-3" :rub="order.priceRub" :suffix="order.priceSuffix" />
      <slot name="action" />
    </div>
  </article>
</template>

<style scoped>
.order-card {
  overflow: hidden;
}

.order-card-cover {
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.order-card-type {
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}

.order-card-type-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  color: var(--bs-body-color);
}
</style>
