<template>
  <article class="saved-route-card">
    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
      <div>
        <span class="type-pill mb-2">
          {{ typeLabel }}
        </span>

        <h3 class="saved-route-title">
          {{ route.title }}
        </h3>

        <p class="saved-route-meta mb-0">
          {{ route.days }} дней · до {{ route.budget }} $
        </p>
      </div>
    </div>

    <div class="saved-route-actions mt-4">
      <RouterLink
        class="btn btn-outline-primary"
        :to="`/destination/${route.placeKey}`"
      >
        Открыть
      </RouterLink>

      <button
        class="btn subtle-action-btn"
        type="button"
        @click="$emit('delete', route.id)"
      >
        Удалить
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])

const typeLabel = computed(() => {
  if (props.route.type === 'city') {
    return 'Город'
  }

  if (props.route.type === 'nature') {
    return 'Природа'
  }

  return 'Маршрут'
})
</script>