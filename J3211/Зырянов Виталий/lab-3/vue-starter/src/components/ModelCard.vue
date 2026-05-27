<script setup>
import { RouterLink } from 'vue-router'
import { useFormat } from '../composables/useFormat'

const props = defineProps({
  model: {
    type: Object,
    required: true
  }
})

const { compactNumber } = useFormat()
</script>

<template>
  <article class="hub-card result-card p-4 mb-3" role="listitem">
    <div class="d-flex justify-content-between flex-wrap gap-2">
      <div class="result-head">
        <h3 class="h5 mb-1">
          <RouterLink :to="{ name: 'model', params: { id: model.id } }">{{ model.title }}</RouterLink>
        </h3>
      </div>
      <span class="status-badge" :class="model.status === 'private' ? 'status-private' : 'status-public'">
        Model {{ model.status === 'private' ? 'Private' : 'Public' }}
      </span>
    </div>

    <p class="muted mb-2">{{ model.description }}</p>

    <div class="mb-2">
      <span class="chip">{{ model.task }}</span>
      <span class="chip">{{ model.framework }}</span>
      <span class="chip">{{ model.size }}</span>
    </div>

    <div class="muted d-flex gap-3 flex-wrap">
      <small>{{ compactNumber(model.downloads) }} загрузок</small>
      <small>{{ compactNumber(model.stars) }} звёзд</small>
      <small>Воспроизводимость: {{ model.reproducibility || 0 }}%</small>
    </div>
  </article>
</template>
