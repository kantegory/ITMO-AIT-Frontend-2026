<script setup>
import { useI18n } from '../composables/useI18n';
import { useTaskMeta } from '../composables/useTaskMeta';

defineProps({ tasks: { type: Array, required: true } });
const emit = defineEmits(['open-task']);

const { t } = useI18n();
const { statusLabel, formatDate, statusBadgeClass } = useTaskMeta();
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>{{ t('project_task') }}</th>
          <th>{{ t('project_assignee') }}</th>
          <th>{{ t('project_deadline_date') }}</th>
          <th>{{ t('project_status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in tasks"
          :key="task.id"
          class="task-clickable"
          @click="emit('open-task', task)"
        >
          <td>{{ task.title }}</td>
          <td>{{ task.assigneeName || '' }}</td>
          <td>{{ formatDate(task.deadline) }}</td>
          <td>
            <span class="badge" :class="statusBadgeClass[task.status] || 'bg-secondary'">
              {{ statusLabel(task.status) }}
            </span>
          </td>
        </tr>
        <tr v-if="!tasks.length">
          <td colspan="4" class="text-muted">—</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
