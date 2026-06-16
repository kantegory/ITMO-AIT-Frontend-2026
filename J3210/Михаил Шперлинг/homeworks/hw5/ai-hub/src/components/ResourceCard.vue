<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  type: { type: String, default: 'models' }
})

const taskBadgeClass = computed(() => {
  const map = {
    cv: 'bg-success bg-opacity-10 text-success border-success',
    audio: 'bg-danger bg-opacity-10 text-danger border-danger',
    nlp: 'bg-info-soft text-primary border-primary'
  }
  return map[props.item.task] || 'bg-secondary'
})
</script>

<template>
  <div :class="['card h-100 shadow-sm resource-card', item.task ? `task-${item.task}` : '']">
    <div class="card-body">
      <h5 class="card-title">
        <router-link
          :to="`/model/${type}/${item.id}`"
          class="text-decoration-none"
        >
          {{ item.title }}
        </router-link>
      </h5>
      <small v-if="item.author" class="text-muted d-block mb-2">Автор: @{{ item.author }}</small>
      <p class="card-text text-muted small">{{ item.desc }}</p>
      <div class="mb-3 d-flex flex-wrap gap-1">
        <span :class="['badge', type === 'datasets' ? 'bg-success' : 'bg-primary']">
          {{ type === 'datasets' ? 'Датасет' : 'Модель' }}
        </span>
        <span :class="['badge border', taskBadgeClass]">{{ item.task?.toUpperCase() }}</span>
        <span v-if="item.framework" class="badge bg-light text-dark border">{{ item.framework }}</span>
        <span v-if="item.format" class="badge bg-light text-dark border">{{ item.format?.toUpperCase() }}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">
          <svg class="svg-icon text-warning" aria-hidden="true">
            <use href="/sprite.svg#icon-star-fill"></use>
          </svg>
          {{ item.stars || 0 }} &bull;
          <svg class="svg-icon" aria-hidden="true">
            <use href="/sprite.svg#icon-download"></use>
          </svg>
          {{ item.downloads || 0 }}
        </small>
        <span class="text-muted small">{{ item.size || '—' }}</span>
      </div>
    </div>
  </div>
</template>
