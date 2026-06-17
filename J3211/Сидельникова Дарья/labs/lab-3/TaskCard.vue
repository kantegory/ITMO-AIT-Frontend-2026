<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="task-card">
    <strong>{{ task.title }}</strong>
    <div class="task-project">{{ task.project || '-' }}</div>
    <div class="task-project">Assignee: {{ task.assigneeName || '-' }}</div>
    <div class="task-project">Creator: {{ task.creatorName || '-' }}</div>
    <div class="task-due">Due: {{ task.due || '-' }}</div>
  </div>
</template>