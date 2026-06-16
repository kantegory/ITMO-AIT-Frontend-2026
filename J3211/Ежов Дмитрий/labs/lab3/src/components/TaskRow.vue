<script setup lang="ts">
import { computed } from 'vue';
import PriorityBadge from './PriorityBadge.vue';
import StatusBadge from './StatusBadge.vue';
import type { Task } from '../types/domain';
import { formatDate, isOverdue } from '../utils/render';

const props = defineProps<{ task: Task; projectName: string }>();

const overdue = computed(() => isOverdue(props.task.deadline, props.task.status));
</script>

<template>
  <RouterLink :to="{ name: 'task', params: { id: task.id } }" class="task-row">
    <div>
      <div class="task-name">{{ task.title }}</div>
      <div class="task-name task-project">{{ projectName }}</div>
    </div>
    <PriorityBadge :priority="task.priority" />
    <StatusBadge :status="task.status" />
    <span class="task-deadline" :class="{ overdue }">{{ formatDate(task.deadline) }}</span>
  </RouterLink>
</template>
