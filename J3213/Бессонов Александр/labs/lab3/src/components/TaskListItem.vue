<script setup>
import { CalendarDays, CircleCheckBig } from '@lucide/vue'

defineProps({ task: { type: Object, required: true } })
</script>

<template>
  <article class="workspace-task-row">
    <span class="workspace-task-key">{{ task.key }}</span>
    <div><strong>{{ task.title }}</strong><small>{{ task.project }} · {{ task.type }}</small></div>
    <span :class="['priority-badge', `priority-${task.priority.toLocaleLowerCase('ru-RU')}`]">{{ task.priority }}</span>
    <span class="workspace-task-due"><CircleCheckBig v-if="task.completed" :size="15" /><CalendarDays v-else :size="15" />{{ task.time }}</span>
    <span class="workspace-task-avatar">{{ task.initials }}</span>
  </article>
</template>
