<script setup>
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  space: { type: Object, required: true },
})

const emit = defineEmits(['apply'])

const btnLabel = (status) => {
  if (status === 'free')     return 'Оставить заявку'
  if (status === 'reserved') return 'Встать в резерв'
  return 'Оставить интерес'
}
</script>

<template>
  <article class="space-card">
    <div class="space-media">
      <img :src="`/img/${space.image}.svg`" :alt="space.name" loading="lazy" />
    </div>
    <div class="space-body">
      <div class="d-flex justify-content-between gap-3 align-items-start">
        <div>
          <h2 class="section-title mb-1">{{ space.name }}</h2>
          <p class="section-text mb-0">{{ space.floor }} этаж, {{ space.area }} м²</p>
        </div>
        <StatusBadge :status="space.status" />
      </div>
      <p class="space-meta">{{ space.price }} ₽ / м². {{ space.note }}</p>
      <button
        class="btn w-100"
        :class="space.status === 'free' ? 'btn-brand' : 'btn-outline-brand'"
        type="button"
        @click="emit('apply', space)"
      >
        {{ btnLabel(space.status) }}
      </button>
    </div>
  </article>
</template>
