<script setup>
import { normalizeImagePath } from '../utils/image';

defineProps({
  application: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <article class="card application-card">
    <img
      :src="normalizeImagePath(application.image)"
      class="card-img-top"
      :alt="`Иллюстрация к задаче: ${application.taskTitle}`"
    />
    <div class="card-body">
      <h2 class="h5 card-title">{{ application.taskTitle }}</h2>
      <p class="mb-2"><strong>Роль:</strong> {{ application.roleLabel }}</p>
      <p class="mb-1"><strong>Статус задачи:</strong> {{ application.status }}</p>
      <p class="mb-1"><strong>Приоритет:</strong> {{ application.priority }}</p>
      <p class="mb-0"><strong>Постановщик:</strong> {{ application.createdBy }}</p>
    </div>
  </article>
</template>
