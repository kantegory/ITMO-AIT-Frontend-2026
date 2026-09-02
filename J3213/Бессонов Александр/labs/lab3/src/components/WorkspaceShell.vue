<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tPulseApi } from '../api/tPulseApi'
import { useTheme } from '../composables/useTheme'
import { useTasksStore } from '../stores/tasks'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import NewTaskModal from './NewTaskModal.vue'
import NotificationsDrawer from './NotificationsDrawer.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  searchOpen: { type: Boolean, default: false },
  inlineSearch: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle-search'])
const router = useRouter()
const taskStore = useTasksStore()
const { projectCards } = storeToRefs(taskStore)
const { theme, toggleTheme } = useTheme()
const sidebarOpen = ref(false)
const notificationsOpen = ref(false)
const newTaskOpen = ref(false)
const toast = ref('')
const notifications = ref([])
let toastTimer
const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.value = '' }, 2600)
}

async function createTask(task) {
  try {
    await taskStore.createTask(task)
    newTaskOpen.value = false
    showToast('Новая задача добавлена через REST API')
  } catch (error) {
    showToast(error.message)
  }
}

async function markNotificationsRead() {
  const unread = notifications.value.filter((item) => !item.read)
  await Promise.all(unread.map((item) => tPulseApi.updateNotification(item.id, { read: true })))
  unread.forEach((item) => { item.read = true })
  showToast('Уведомления прочитаны')
}

function handleSearch() {
  if (props.inlineSearch) emit('toggle-search')
  else router.push('/search')
}

onMounted(async () => {
  try {
    await taskStore.loadDashboard()
    notifications.value = await tPulseApi.getNotifications({ userId: 1 })
  } catch (error) {
    showToast(error.message)
  }
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="app-content">
      <AppTopbar
        :title="title"
        :subtitle="subtitle"
        :theme="theme"
        :unread-count="unreadCount"
        :search-open="searchOpen"
        @toggle-theme="toggleTheme"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-search="handleSearch"
        @toggle-notifications="notificationsOpen = !notificationsOpen"
        @new-task="newTaskOpen = true"
      />
      <main id="mainContent" class="page-main"><slot /></main>
      <footer class="app-footer"><span>Т‑Пульс</span><span>Vue Router · Pinia · Axios</span></footer>
    </div>

    <NotificationsDrawer :open="notificationsOpen" :notifications="notifications" @close="notificationsOpen = false" @mark-read="markNotificationsRead" />
    <NewTaskModal :open="newTaskOpen" :projects="projectCards" @close="newTaskOpen = false" @create="createTask" />
    <Transition name="toast"><div v-if="toast" class="app-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{{ toast }}</div></Transition>
  </div>
</template>
