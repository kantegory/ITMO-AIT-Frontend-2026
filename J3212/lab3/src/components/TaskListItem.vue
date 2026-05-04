<script setup>
import { useTaskMeta } from '../composables/useTaskMeta';

defineProps({ task: { type: Object, required: true } });

const { statusLabel, statusBadgeClass } = useTaskMeta();
</script>

<template>
  <RouterLink
    :to="{ name: 'project', params: { id: task.projectId || 1 } }"
    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
  >
    <span>{{ task.title }}</span>
    <span class="badge rounded-pill" :class="statusBadgeClass[task.status] || 'bg-secondary'">
      {{ statusLabel(task.status) }}
    </span>
  </RouterLink>
</template>
