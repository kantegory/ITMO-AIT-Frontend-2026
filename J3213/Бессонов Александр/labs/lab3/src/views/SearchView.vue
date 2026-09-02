<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import TaskListItem from '../components/TaskListItem.vue'
import WorkspaceShell from '../components/WorkspaceShell.vue'
import { useTaskFilters } from '../composables/useTaskFilters'
import { useTasksStore } from '../stores/tasks'

const taskStore = useTasksStore()
const { dashboardTasks, backlogTasks, loading, error } = storeToRefs(taskStore)
const allTasks = computed(() => [...dashboardTasks.value, ...backlogTasks.value])
const { searchQuery, filteredTasks: queryTasks, resetSearch } = useTaskFilters(allTasks)
const priority = ref('')
const scope = ref('')
const filteredTasks = computed(() => queryTasks.value.filter((task) => {
  const matchesPriority = !priority.value || task.priority === priority.value
  const matchesScope = !scope.value || (scope.value === 'backlog' ? task.scope === 'backlog' : task.scope !== 'backlog')
  return matchesPriority && matchesScope
}))

function resetFilters() {
  resetSearch()
  priority.value = ''
  scope.value = ''
}
</script>

<template>
  <WorkspaceShell title="Поиск" subtitle="Задачи всех проектов" search-open>
    <section class="workspace-heading"><div><p class="eyebrow">Все проекты</p><h1>Поиск задач</h1><p>Найдите задачу по названию, проекту или приоритету.</p></div></section>
    <div class="search-page-controls">
      <input v-model="searchQuery" type="search" placeholder="Введите название, проект или приоритет" autofocus />
      <select v-model="priority"><option value="">Любой приоритет</option><option>Высокий</option><option>Средний</option><option>Низкий</option></select>
      <select v-model="scope"><option value="">Все разделы</option><option value="board">Доска</option><option value="backlog">Бэклог</option></select>
      <button type="button" @click="resetFilters">Сбросить</button>
    </div>
    <div v-if="loading" class="api-state">Загрузка задач…</div>
    <div v-else-if="error" class="api-state api-state-error">{{ error }}</div>
    <section class="workspace-list-card"><header><div><h2>Результаты</h2><p>{{ searchQuery ? `По запросу «${searchQuery}»` : 'Все задачи рабочего пространства' }}</p></div><strong>{{ filteredTasks.length }}</strong></header><div class="workspace-task-list"><TaskListItem v-for="task in filteredTasks" :key="task.id" :task="task" /><div v-if="!filteredTasks.length" class="workspace-empty">Задачи не найдены. Измените параметры поиска.</div></div></section>
  </WorkspaceShell>
</template>
