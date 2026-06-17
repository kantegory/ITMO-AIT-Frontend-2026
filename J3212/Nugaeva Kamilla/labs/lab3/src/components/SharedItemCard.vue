<template>
  <article class="shared-entry-card">
    <div class="shared-entry-top">
      <div>
        <span class="type-pill mb-2">
          {{ typeLabel }}
        </span>

        <h3 class="shared-entry-title">
          {{ item.title }}
        </h3>

        <p class="shared-entry-meta mb-0">
          От {{ item.authorName || 'пользователя' }} для {{ item.to }}
        </p>
      </div>

      <button
        class="btn subtle-action-btn btn-sm"
        type="button"
        @click="$emit('delete', item.id)"
      >
        Удалить
      </button>
    </div>

    <p v-if="item.note" class="shared-entry-note mb-0">
      {{ item.note }}
    </p>

    <p v-else class="text-muted mb-0">
      Заметка не добавлена.
    </p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])

const typeLabel = computed(() => {
  if (props.item.type === 'city') {
    return 'Город'
  }

  if (props.item.type === 'nature') {
    return 'Природа'
  }

  return 'Маршрут'
})
</script>