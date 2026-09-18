<template>
  <div class="pipeline-graph" aria-label="Граф задач DAG">
    <div v-for="(row, rowIndex) in graph" :key="rowIndex" class="dag-flow" :class="{ 'mt-3': rowIndex > 0 }">
      <template v-for="(task, taskIndex) in row" :key="task.name">
        <article
          class="task-card pipeline-graph__task"
          :class="{ active: selectedTask === task.name }"
          role="button"
          tabindex="0"
          :aria-pressed="selectedTask === task.name"
          :aria-label="`Задача ${task.name}, статус ${task.status}`"
          @click="selectedTask = task.name"
          @keydown.enter.prevent="selectedTask = task.name"
          @keydown.space.prevent="selectedTask = task.name"
        >
          <h3>{{ task.name }}</h3>
          <StatusBadge :status="task.status" />
        </article>
        <span v-if="taskIndex < row.length - 1" class="flow-arrow" aria-hidden="true">→</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatusBadge from './StatusBadge.vue';

defineProps({
  graph: {
    type: Array,
    default: () => []
  }
});

const selectedTask = ref('');
</script>
