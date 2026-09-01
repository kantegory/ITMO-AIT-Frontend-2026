<script setup>
import { Check, Clock3, Ellipsis, Video } from '@lucide/vue'

defineProps({ tasks: { type: Array, required: true } })
defineEmits(['toggle'])
</script>

<template>
  <section id="tasks" class="surface-card tasks-card" aria-labelledby="todayTasksTitle">
    <div class="section-heading compact">
      <div><h2 id="todayTasksTitle">Задачи на сегодня</h2><p>{{ tasks.length }} задач требуют вашего внимания</p></div>
      <button class="small-icon-button" type="button" aria-label="Дополнительные действия"><Ellipsis /></button>
    </div>

    <div v-if="tasks.length" class="task-list">
      <article v-for="task in tasks" :id="`task-${task.id}`" :key="task.id" class="task-row">
        <button
          :class="['task-check', { complete: task.completed }]"
          type="button"
          :aria-label="task.completed ? 'Вернуть задачу в работу' : 'Отметить задачу выполненной'"
          @click="$emit('toggle', task.id)"
        ><Check /></button>
        <div :class="['task-main', { complete: task.completed }]">
          <strong>{{ task.title }}</strong><span>{{ task.project }}</span>
        </div>
        <span :class="['priority-badge', `priority-${task.priority.toLocaleLowerCase('ru-RU')}`]">{{ task.priority }}</span>
        <span class="task-time">
          <Video v-if="task.meeting && !task.completed" :size="16" />
          <Clock3 v-else-if="!task.completed" :size="16" />
          <Check v-else :size="16" />
          {{ task.time }}
        </span>
      </article>
    </div>
    <div v-else class="empty-state"><span>⌕</span><strong>Ничего не найдено</strong><p>Измените поисковый запрос.</p></div>
  </section>
</template>
