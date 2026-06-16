<script setup lang="ts">
import { computed } from 'vue';
import PriorityBadge from './PriorityBadge.vue';
import StatusBadge from './StatusBadge.vue';
import type { Task } from '../types/domain';
import { useAuth } from '../composables/useAuth';
import { formatDate, isOverdue } from '../utils/render';

const props = defineProps<{ task: Task; projectName: string }>();

const { user } = useAuth();
const overdue = computed(() => isOverdue(props.task.deadline, props.task.status));
const assigneeLabel = computed(() =>
  user.value && user.value.id === props.task.assigneeId
    ? user.value.name
    : `#${props.task.assigneeId}`,
);
</script>

<template>
  <RouterLink :to="{ name: 'task', params: { id: task.id } }" class="task-card">
    <div>
      <div class="task-card-title">{{ task.title }}</div>
      <div class="task-card-meta">
        <span class="meta-project"><span class="meta-dot" />{{ projectName || '—' }}</span>
        <span>{{ assigneeLabel }}</span>
      </div>
    </div>
    <PriorityBadge :priority="task.priority" />
    <StatusBadge :status="task.status" />
    <span class="task-deadline" :class="{ overdue }">{{ formatDate(task.deadline) }}</span>
    <button class="task-menu-btn" @click.prevent>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
      </svg>
    </button>
  </RouterLink>
</template>
