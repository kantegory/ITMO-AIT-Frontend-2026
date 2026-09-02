<script setup>
import { CalendarDays } from '@lucide/vue'

const props = defineProps({
  column: { type: Object, required: true },
  tasks: { type: Array, required: true },
})
const emit = defineEmits(['move'])

function startDrag(event, id) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(id))
}

function drop(event) {
  const id = Number(event.dataTransfer.getData('text/plain'))
  if (id) emit('move', id, props.column.id)
}
</script>

<template>
  <section :class="['kanban-column', `column-${column.id}`]" @dragover.prevent @drop="drop">
    <header><h2>{{ column.title }}</h2><span>{{ tasks.length }}</span></header>
    <div class="kanban-stack">
      <article v-for="task in tasks" :key="task.id" class="kanban-card" draggable="true" @dragstart="startDrag($event, task.id)">
        <div class="kanban-card-meta"><span>{{ task.type }}</span><strong>{{ task.key }}</strong></div>
        <h3>{{ task.title }}</h3>
        <div class="task-labels"><span v-for="label in task.labels" :key="label">{{ label }}</span></div>
        <footer><span :class="['priority-badge', `priority-${task.priority.toLocaleLowerCase('ru-RU')}`]">{{ task.priority }}</span><span><CalendarDays :size="14" />{{ task.time }}</span><b>{{ task.initials }}</b></footer>
      </article>
      <div v-if="!tasks.length" class="kanban-empty">Перетащите задачу сюда</div>
    </div>
  </section>
</template>
