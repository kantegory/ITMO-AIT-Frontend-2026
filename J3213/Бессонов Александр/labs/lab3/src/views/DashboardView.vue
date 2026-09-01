<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import NewTaskModal from '../components/NewTaskModal.vue'
import NotificationsDrawer from '../components/NotificationsDrawer.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import StatsGrid from '../components/StatsGrid.vue'
import TodayTasks from '../components/TodayTasks.vue'
import { useTaskFilters } from '../composables/useTaskFilters'
import { useTheme } from '../composables/useTheme'
import { useTasksStore } from '../stores/tasks'

const taskStore = useTasksStore()
const { dashboardTasks, projectCards, stats, loading, error } = storeToRefs(taskStore)
const { theme, toggleTheme } = useTheme()
const { searchQuery, filteredTasks, resetSearch } = useTaskFilters(dashboardTasks)

const activities = [
  { id: 1, initials: 'МС', tone: 'pink', text: 'Мария завершила задачу «Сценарий онбординга»', time: '18 минут назад' },
  { id: 2, initials: 'ИВ', tone: 'blue', text: 'Илья добавил 3 файла в проект', time: '1 час назад' },
  { id: 3, initials: 'АК', tone: 'lime', text: 'Анна оставила комментарий к макету', time: '2 часа назад' },
]

const notifications = ref([
  { id: 1, title: 'Вас упомянули', text: 'Мария упомянула вас в задаче «UI-kit»', read: false },
  { id: 2, title: 'Задача завершена', text: 'Илья закрыл задачу «Настроить аналитику»', read: false },
  { id: 3, title: 'Срок проекта', text: 'До релиза мобильного приложения 12 дней', read: true },
])

const sidebarOpen = ref(false)
const notificationsOpen = ref(false)
const newTaskOpen = ref(false)
const searchOpen = ref(false)
const toast = ref('')
let toastTimer

const unreadCount = () => notifications.value.filter((item) => !item.read).length

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2600)
}

async function toggleTask(id) {
  try {
    const task = await taskStore.toggleTask(id)
    showToast(task?.status === 'done' ? 'Задача завершена' : 'Задача возвращена в работу')
  } catch (requestError) {
    showToast(requestError.message)
  }
}

async function createTask(task) {
  try {
    await taskStore.createTask(task)
    newTaskOpen.value = false
    showToast('Новая задача добавлена через REST API')
  } catch (requestError) {
    showToast(requestError.message)
  }
}

function markNotificationsRead() {
  notifications.value.forEach((item) => {
    item.read = true
  })
  showToast('Уведомления прочитаны')
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) resetSearch()
}

onMounted(async () => {
  try {
    await taskStore.loadDashboard()
  } catch (requestError) {
    showToast(requestError.message)
  }
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="app-content">
      <AppTopbar
        :theme="theme"
        :unread-count="unreadCount()"
        :search-open="searchOpen"
        @toggle-theme="toggleTheme"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-search="toggleSearch"
        @toggle-notifications="notificationsOpen = !notificationsOpen"
        @new-task="newTaskOpen = true"
      />

      <main id="mainContent" class="page-main">
        <section class="welcome-section" aria-labelledby="pageTitle">
          <div>
            <p class="eyebrow">Понедельник, 30 августа</p>
            <h1 id="pageTitle">Добрый день, Александр</h1>
            <p>Вот что происходит в ваших проектах сегодня.</p>
          </div>
          <button class="outline-button" type="button" @click="toggleSearch"><span aria-hidden="true">⌕</span> Все задачи</button>
        </section>

        <Transition name="slide-fade">
          <form v-if="searchOpen" class="search-panel" role="search" @submit.prevent>
            <label for="dashboardSearch">Поиск по задачам</label>
            <div class="search-control">
              <input
                id="dashboardSearch"
                v-model="searchQuery"
                type="search"
                placeholder="Название, проект или приоритет"
                autofocus
              />
              <button v-if="searchQuery" type="button" aria-label="Очистить поиск" @click="searchQuery = ''">×</button>
            </div>
            <span>{{ filteredTasks.length }} найдено</span>

            <div v-if="searchQuery.trim()" class="quick-search-results" aria-live="polite">
              <a v-for="task in filteredTasks" :key="task.id" :href="`#task-${task.id}`" class="quick-search-item">
                <span :class="['quick-result-status', { complete: task.completed }]" aria-hidden="true">{{ task.completed ? '✓' : '•' }}</span>
                <span><strong>{{ task.title }}</strong><small>{{ task.project }}</small></span>
                <span class="quick-result-priority">{{ task.priority }}</span>
              </a>
              <div v-if="!filteredTasks.length" class="quick-search-empty">
                <strong>Задачи не найдены</strong>
                <span>Попробуйте изменить запрос.</span>
              </div>
            </div>
          </form>
        </Transition>

        <div v-if="loading" class="api-state" role="status">Загрузка данных из REST API…</div>
        <div v-else-if="error" class="api-state api-state-error" role="alert">
          <strong>Не удалось загрузить данные.</strong>
          <span>{{ error }}</span>
          <button type="button" @click="taskStore.loadDashboard({ force: true })">Повторить</button>
        </div>

        <StatsGrid :stats="stats" />
        <ProjectGrid :projects="projectCards" />

        <div class="dashboard-lower-grid">
          <TodayTasks :tasks="filteredTasks" @toggle="toggleTask" />
          <ActivityFeed :activities="activities" />
        </div>
      </main>

      <footer class="app-footer"><span>Т‑Пульс</span><span>Vue Router · Pinia · Axios</span></footer>
    </div>

    <NotificationsDrawer
      :open="notificationsOpen"
      :notifications="notifications"
      @close="notificationsOpen = false"
      @mark-read="markNotificationsRead"
    />
    <NewTaskModal :open="newTaskOpen" :projects="projectCards" @close="newTaskOpen = false" @create="createTask" />

    <Transition name="toast">
      <div v-if="toast" class="app-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{{ toast }}</div>
    </Transition>
  </div>
</template>
