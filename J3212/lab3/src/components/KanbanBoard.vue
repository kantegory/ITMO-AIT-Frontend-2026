<script setup>
import { computed } from 'vue';
import { useI18n } from '../composables/useI18n';
import KanbanCard from './KanbanCard.vue';

const props = defineProps({
  tasks: { type: Array, required: true },
});
const emit = defineEmits(['open-task', 'move-task']);

const { t } = useI18n();

const columns = [
  { key: 'new', label: 'status_new' },
  { key: 'progress', label: 'status_progress' },
  { key: 'review', label: 'status_review' },
  { key: 'done', label: 'status_done' },
];

const tasksByStatus = computed(() => {
  const map = { new: [], progress: [], review: [], done: [] };
  props.tasks.forEach((task) => {
    const key = map[task.status] ? task.status : 'new';
    map[key].push(task);
  });
  return map;
});

function onDragOver(e, column) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  column.dragOver = true;
}

function onDragLeave(column) {
  column.dragOver = false;
}

function onDrop(e, columnKey, column) {
  e.preventDefault();
  column.dragOver = false;
  let taskIdRaw = '';
  try { taskIdRaw = e.dataTransfer.getData('text/task-id') || ''; } catch (err) {}
  const taskId = parseInt(taskIdRaw, 10);
  if (!taskId) return;
  emit('move-task', taskId, columnKey);
}
</script>

<template>
  <div>
    <p class="text-muted small mb-2">{{ t('project_drag_hint') }}</p>
    <div class="row g-3">
      <div v-for="column in columns" :key="column.key" class="col-md-3">
        <div class="kanban-column p-3 rounded">
          <h6 class="text-muted mb-3">{{ t(column.label) }}</h6>
          <div
            class="kanban-column-cards"
            :class="{ 'drag-over': column.dragOver }"
            @dragover="onDragOver($event, column)"
            @dragleave="onDragLeave(column)"
            @drop="onDrop($event, column.key, column)"
          >
            <KanbanCard
              v-for="task in tasksByStatus[column.key]"
              :key="task.id"
              :task="task"
              @open="(t) => emit('open-task', t)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
