<script setup>
defineProps({ task: Object })
</script>

<template>
  <article class="task-row" role="listitem">
    <div>
      <div class="fw-bold mb-1 clamp-2" :title="task.title">{{ task.title }}</div>
      <div class="task-row-meta text-wrap-anywhere" :title="task.projectTitle">{{ task.projectTitle }}</div>
      <div class="task-row-meta text-wrap-anywhere">{{ task.assignee }} · {{ task.due }}</div>
    </div>
    <RouterLink
      class="btn btn-light"
      :to="`/project/${task.projectId}`"
      :aria-label="`Открыть задачу ${task.title}`"
    >Открыть</RouterLink>
  </article>
</template>
