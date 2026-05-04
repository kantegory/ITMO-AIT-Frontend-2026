<script setup>
import { useTaskMeta } from '../composables/useTaskMeta';

const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['open', 'dragstart', 'dragend']);

const { priorityLabel, priorityClass } = useTaskMeta();

let dragging = false;

function onDragStart(e) {
  dragging = true;
  try {
    e.dataTransfer.setData('text/task-id', String(props.task.id || ''));
    e.dataTransfer.effectAllowed = 'move';
  } catch (err) {}
  emit('dragstart', props.task);
}

function onDragEnd() {
  setTimeout(() => { dragging = false; }, 0);
  emit('dragend', props.task);
}

function onClick() {
  if (dragging) return;
  emit('open', props.task);
}
</script>

<template>
  <div
    class="card kanban-card mb-2 task-clickable"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="onClick"
  >
    <div class="card-body py-2">
      <span
        v-if="task.priority"
        class="badge mb-1"
        :class="priorityClass[task.priority] || ''"
      >{{ priorityLabel(task.priority) }}</span>
      <p class="mb-0 small">{{ task.title }}</p>
    </div>
  </div>
</template>
