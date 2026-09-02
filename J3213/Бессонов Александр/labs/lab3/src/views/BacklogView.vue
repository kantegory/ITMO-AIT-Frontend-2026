<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import NewTaskModal from '../components/NewTaskModal.vue'
import TaskListItem from '../components/TaskListItem.vue'
import WorkspaceShell from '../components/WorkspaceShell.vue'
import { useTaskFilters } from '../composables/useTaskFilters'
import { useTasksStore } from '../stores/tasks'

const taskStore = useTasksStore()
const { backlogTasks, projectCards, loading, error } = storeToRefs(taskStore)
const { searchQuery, filteredTasks: queryTasks, resetSearch } = useTaskFilters(backlogTasks)
const priority = ref('')
const modalOpen = ref(false)
const message = ref('')
const filteredTasks = computed(() => queryTasks.value.filter((task) => !priority.value || task.priority === priority.value))

async function createBacklogTask(task) {
  try {
    await taskStore.createTask(task, { status: 'backlog', scope: 'backlog' })
    modalOpen.value = false
    message.value = 'Задача добавлена в бэклог через REST API'
  } catch (requestError) {
    message.value = requestError.message
  }
}

function resetFilters() {
  resetSearch()
  priority.value = ''
}
</script>

<template>
  <WorkspaceShell title="Бэклог" subtitle="Планирование спринта">
    <section class="workspace-heading">
      <div><p class="eyebrow">Мобильное приложение</p><h1>Бэклог</h1><p>Планируйте спринт, уточняйте приоритеты и готовьте задачи к работе.</p></div>
      <button class="outline-button" type="button" @click="modalOpen = true">Добавить задачу</button>
    </section>

    <div class="workspace-filterbar">
      <input v-model="searchQuery" type="search" placeholder="Поиск по названию или ключу" aria-label="Поиск по бэклогу" />
      <select v-model="priority" aria-label="Приоритет"><option value="">Любой приоритет</option><option>Высокий</option><option>Средний</option><option>Низкий</option></select>
      <span>{{ filteredTasks.length }} задач</span><button type="button" @click="resetFilters">Сбросить</button>
    </div>

    <div v-if="loading" class="api-state">Загрузка бэклога…</div>
    <div v-else-if="error" class="api-state api-state-error">{{ error }}</div>
    <p v-if="message" class="workspace-message" role="status">{{ message }}</p>
    <section class="workspace-list-card"><header><div><h2>Бэклог продукта</h2><p>Задачи, ещё не добавленные в спринт</p></div><strong>{{ filteredTasks.length }}</strong></header><div class="workspace-task-list"><TaskListItem v-for="task in filteredTasks" :key="task.id" :task="task" /><div v-if="!filteredTasks.length" class="workspace-empty">Подходящих задач не найдено.</div></div></section>

    <NewTaskModal :open="modalOpen" :projects="projectCards" @close="modalOpen = false" @create="createBacklogTask" />
  </WorkspaceShell>
</template>
