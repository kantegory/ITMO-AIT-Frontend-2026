<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import StatsGrid from '../components/StatsGrid.vue'
import TodayTasks from '../components/TodayTasks.vue'
import WorkspaceShell from '../components/WorkspaceShell.vue'
import { useTaskFilters } from '../composables/useTaskFilters'
import { useTasksStore } from '../stores/tasks'

const taskStore = useTasksStore()
const { dashboardTasks, projectCards, stats, loading, error } = storeToRefs(taskStore)
const { searchQuery, filteredTasks, resetSearch } = useTaskFilters(dashboardTasks)
const searchOpen = ref(false)
const toast = ref('')
let toastTimer
const activities = [
  { id: 1, initials: 'МС', tone: 'pink', text: 'Мария завершила задачу «Сценарий онбординга»', time: '18 минут назад' },
  { id: 2, initials: 'ИВ', tone: 'blue', text: 'Илья добавил 3 файла в проект', time: '1 час назад' },
  { id: 3, initials: 'АК', tone: 'lime', text: 'Анна оставила комментарий к макету', time: '2 часа назад' },
]

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.value = '' }, 2600)
}

async function toggleTask(id) {
  try {
    const task = await taskStore.toggleTask(id)
    showToast(task?.status === 'done' ? 'Задача завершена' : 'Задача возвращена в работу')
  } catch (requestError) {
    showToast(requestError.message)
  }
}

async function reload() {
  try {
    await taskStore.loadDashboard({ force: true })
  } catch (requestError) {
    showToast(requestError.message)
  }
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) resetSearch()
}
</script>

<template>
  <WorkspaceShell title="Обзор" subtitle="Проекты и задачи команды" :search-open="searchOpen" inline-search @toggle-search="toggleSearch">
    <section class="welcome-section" aria-labelledby="pageTitle">
      <div><p class="eyebrow">Понедельник, 30 августа</p><h1 id="pageTitle">Добрый день, Александр</h1><p>Вот что происходит в ваших проектах сегодня.</p></div>
      <button class="outline-button" type="button" @click="toggleSearch"><span aria-hidden="true">⌕</span> Все задачи</button>
    </section>

    <Transition name="slide-fade">
      <form v-if="searchOpen" class="search-panel" role="search" @submit.prevent>
        <label for="dashboardSearch">Поиск по задачам</label>
        <div class="search-control"><input id="dashboardSearch" v-model="searchQuery" type="search" placeholder="Название, проект или приоритет" autofocus /><button v-if="searchQuery" type="button" aria-label="Очистить поиск" @click="searchQuery = ''">×</button></div>
        <span>{{ filteredTasks.length }} найдено</span>
        <div v-if="searchQuery.trim()" class="quick-search-results" aria-live="polite">
          <a v-for="task in filteredTasks" :key="task.id" :href="`#task-${task.id}`" class="quick-search-item"><span :class="['quick-result-status', { complete: task.completed }]" aria-hidden="true">{{ task.completed ? '✓' : '•' }}</span><span><strong>{{ task.title }}</strong><small>{{ task.project }}</small></span><span class="quick-result-priority">{{ task.priority }}</span></a>
          <div v-if="!filteredTasks.length" class="quick-search-empty"><strong>Задачи не найдены</strong><span>Попробуйте изменить запрос.</span></div>
        </div>
      </form>
    </Transition>

    <div v-if="loading" class="api-state" role="status">Загрузка данных из REST API…</div>
    <div v-else-if="error" class="api-state api-state-error" role="alert"><strong>Не удалось загрузить данные.</strong><span>{{ error }}</span><button type="button" @click="reload">Повторить</button></div>

    <StatsGrid :stats="stats" />
    <ProjectGrid :projects="projectCards" />
    <div class="dashboard-lower-grid"><TodayTasks :tasks="filteredTasks" @toggle="toggleTask" /><ActivityFeed :activities="activities" /></div>
    <Transition name="toast"><div v-if="toast" class="app-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{{ toast }}</div></Transition>
  </WorkspaceShell>
</template>
