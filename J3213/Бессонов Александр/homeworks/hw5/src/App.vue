<script setup>
import { computed, ref, watch } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import StatsGrid from './components/StatsGrid.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import TodayTasks from './components/TodayTasks.vue'
import ActivityFeed from './components/ActivityFeed.vue'
import NotificationsDrawer from './components/NotificationsDrawer.vue'
import NewTaskModal from './components/NewTaskModal.vue'

const TASKS_KEY = 't-pulse-vue-tasks'
const THEME_KEY = 't-pulse-vue-theme'

const initialTasks = [
  { id: 117, title: 'Подготовить прототип экрана профиля', project: 'Мобильное приложение', priority: 'Высокий', time: '12:30', completed: false },
  { id: 119, title: 'Проверить тексты для главной страницы', project: 'Редизайн сайта', priority: 'Средний', time: '15:00', completed: false },
  { id: 121, title: 'Собрать требования к дашборду', project: 'Модуль аналитики', priority: 'Низкий', time: 'Готово', completed: true },
  { id: 124, title: 'Командная встреча по итогам спринта', project: 'Digital Lab', priority: 'Средний', time: '17:30', completed: false, meeting: true },
]

const projects = [
  {
    id: 1,
    name: 'Мобильное приложение',
    description: 'Обновление личного кабинета и онбординга',
    progress: 68,
    deadline: '12 сен.',
    status: 'Активен',
    color: 'yellow',
    icon: 'phone',
    members: ['+3', 'МС', 'АБ'],
  },
  {
    id: 2,
    name: 'Редизайн сайта',
    description: 'Новая структура каталога и визуальный стиль',
    progress: 42,
    deadline: '25 сен.',
    status: 'Активен',
    color: 'green',
    icon: 'window',
    members: ['+2', 'ИВ', 'АК'],
  },
  {
    id: 3,
    name: 'Модуль аналитики',
    description: 'Метрики продукта и отчёты для команды',
    progress: 18,
    deadline: '8 окт.',
    status: 'Планирование',
    color: 'orange',
    icon: 'chart',
    members: ['+1', 'АБ'],
  },
]

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

function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY)
    return saved ? JSON.parse(saved) : initialTasks
  } catch {
    return initialTasks
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const tasks = ref(loadTasks())
const theme = ref(getInitialTheme())
const sidebarOpen = ref(false)
const notificationsOpen = ref(false)
const newTaskOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const toast = ref('')
let toastTimer

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')
  if (!query) return tasks.value
  return tasks.value.filter((task) =>
    [task.title, task.project, task.priority].join(' ').toLocaleLowerCase('ru-RU').includes(query),
  )
})

const stats = computed(() => {
  const completed = tasks.value.filter((task) => task.completed).length
  const active = tasks.value.length - completed
  return {
    total: 8 + tasks.value.length,
    active: 2 + active,
    completed: 17 + completed,
    overdue: 1 + tasks.value.filter((task) => !task.completed && task.priority === 'Высокий').length,
  }
})

const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2600)
}

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id)
  if (!task) return
  task.completed = !task.completed
  task.time = task.completed ? 'Готово' : task.meeting ? '17:30' : 'Сегодня'
  showToast(task.completed ? 'Задача завершена' : 'Задача возвращена в работу')
}

function createTask(task) {
  tasks.value.unshift({ ...task, id: Date.now(), completed: false })
  newTaskOpen.value = false
  showToast('Новая задача добавлена')
}

function markNotificationsRead() {
  notifications.value.forEach((item) => {
    item.read = true
  })
  showToast('Уведомления прочитаны')
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) searchQuery.value = ''
}

watch(tasks, (value) => localStorage.setItem(TASKS_KEY, JSON.stringify(value)), { deep: true })

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    localStorage.setItem(THEME_KEY, value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="app-content">
      <AppTopbar
        :theme="theme"
        :unread-count="unreadCount"
        :search-open="searchOpen"
        @toggle-theme="theme = theme === 'light' ? 'dark' : 'light'"
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

        <StatsGrid :stats="stats" />
        <ProjectGrid :projects="projects" />

        <div class="dashboard-lower-grid">
          <TodayTasks :tasks="filteredTasks" @toggle="toggleTask" />
          <ActivityFeed :activities="activities" />
        </div>
      </main>

      <footer class="app-footer"><span>Т‑Пульс</span><span>Vue 3 · Vite · npm</span></footer>
    </div>

    <NotificationsDrawer
      :open="notificationsOpen"
      :notifications="notifications"
      @close="notificationsOpen = false"
      @mark-read="markNotificationsRead"
    />
    <NewTaskModal :open="newTaskOpen" :projects="projects" @close="newTaskOpen = false" @create="createTask" />

    <Transition name="toast">
      <div v-if="toast" class="app-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{{ toast }}</div>
    </Transition>
  </div>
</template>
