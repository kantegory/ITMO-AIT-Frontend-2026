<script setup>
import { normalizeImagePath } from '../utils/image';

defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['open']);
</script>

<template>
  <article class="card task-card">
    <button
      type="button"
      class="task-card-button"
      :aria-label="`Открыть задачу ${task.title}. Статус: ${task.status}. Приоритет: ${task.priority}. Постановщик: ${task.createdBy.name}.`"
      @click="$emit('open', task)"
    >
      <img :src="normalizeImagePath(task.image)" class="card-img-top" :alt="`Иллюстрация к задаче: ${task.title}`" />
      <div class="card-body w-100">
        <h2 class="h4 card-title">{{ task.title }}</h2>
        <p class="mb-1"><span class="fw-semibold">Статус:</span> {{ task.status }}</p>
        <p class="mb-1"><span class="fw-semibold">Приоритет:</span> {{ task.priority }}</p>
        <p class="mb-0"><span class="fw-semibold">Постановщик:</span> {{ task.createdBy.name }}</p>
      </div>
    </button>
  </article>
</template>
