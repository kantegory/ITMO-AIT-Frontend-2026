<template>
  <article class="project-card p-4 bg-white">
    <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
      <h3 class="h5 mb-0">{{ project.title }}</h3>
      <span :class="`badge text-bg-${project.statusVariant}`">{{ project.statusLabel }}</span>
    </div>
    <p class="text-secondary mb-2">
      Тип: {{ project.type }} | Дедлайн: {{ formatDate(project.deadline) }} | Исполнитель: {{ project.worker }}
    </p>
    <RouterLink :to="`/task/${project.taskId}`" class="btn btn-sm btn-brand">
      Открыть задачу
    </RouterLink>
  </article>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
})

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ru-RU').format(date)
}
</script>
