<script setup>
defineProps({ note: Object })
</script>

<template>
  <article class="note-card" role="listitem">
    <div class="fw-bold mb-1">{{ note.projectTitle }}</div>
    <div class="note-meta mb-2">{{ note.author }} · {{ note.time }}</div>
    <p class="mb-3">{{ note.text }}</p>
    <RouterLink class="btn btn-light btn-sm" :to="`/project/${note.projectId}`">Перейти к проекту</RouterLink>
  </article>
</template>
