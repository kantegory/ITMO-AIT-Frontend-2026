<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import KanbanColumn from '../components/KanbanColumn.vue'
import WorkspaceShell from '../components/WorkspaceShell.vue'
import { useTasksStore } from '../stores/tasks'

const taskStore = useTasksStore()
const { dashboardTasks, loading, error } = storeToRefs(taskStore)
const query = ref('')
const priority = ref('')
const message = ref('')
const columns = [
  { id: 'todo', title: 'К выполнению' },
  { id: 'progress', title: 'В работе' },
  { id: 'review', title: 'На проверке' },
  { id: 'done', title: 'Готово' },
]

const filteredTasks = computed(() => {
  const value = query.value.trim().toLocaleLowerCase('ru-RU')
  return dashboardTasks.value.filter((task) => {
    const matchesQuery = !value || [task.title, task.key, task.type, task.assignee].join(' ').toLocaleLowerCase('ru-RU').includes(value)
    const matchesPriority = !priority.value || task.priority === priority.value
    return matchesQuery && matchesPriority
  })
})

function tasksFor(status) {
  return filteredTasks.value.filter((task) => task.status === status)
}

async function moveTask(id, status) {
  try {
    await taskStore.moveTask(id, status)
    message.value = 'Статус задачи обновлён через REST API'
  } catch (requestError) {
    message.value = requestError.message
  }
}

function resetFilters() {
  query.value = ''
  priority.value = ''
}
</script>

<template>
  <WorkspaceShell title="Мобильное приложение" subtitle="Доска проекта">
    <section class="workspace-heading">
      <div><p class="eyebrow">Проект · В работе</p><h1>Мобильное приложение</h1><p>Обновление личного кабинета и сценария первого входа.</p><div class="workspace-meta"><span>12 августа — 12 сентября</span><span>5 участников</span><span>{{ dashboardTasks.length }} задач</span></div></div>
      <RouterLink class="outline-button" to="/team">Команда</RouterLink>
    </section>

    <div class="workspace-filterbar">
      <input v-model="query" type="search" placeholder="Поиск по доске" aria-label="Поиск по доске" />
      <select v-model="priority" aria-label="Приоритет"><option value="">Любой приоритет</option><option>Высокий</option><option>Средний</option><option>Низкий</option></select>
      <span>{{ filteredTasks.length }} задач</span>
      <button type="button" @click="resetFilters">Сбросить</button>
    </div>

    <div v-if="loading" class="api-state">Загрузка доски…</div>
    <div v-else-if="error" class="api-state api-state-error">{{ error }}</div>
    <p v-if="message" class="workspace-message" role="status">{{ message }}</p>

    <div class="kanban-board">
      <KanbanColumn v-for="column in columns" :key="column.id" :column="column" :tasks="tasksFor(column.id)" @move="moveTask" />
    </div>
  </WorkspaceShell>
</template>
