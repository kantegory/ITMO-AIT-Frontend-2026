import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import SearchView from '../views/SearchView.vue'
import TaskView from '../views/TaskView.vue'
import WorkersView from '../views/WorkersView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { guest: true }, name: 'login' },
  { path: '/register', component: RegisterView, meta: { guest: true }, name: 'register' },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true }, name: 'dashboard' },
  { path: '/search', component: SearchView, meta: { requiresAuth: true }, name: 'search' },
  { path: '/task/:id', component: TaskView, meta: { requiresAuth: true }, name: 'task' },
  { path: '/workers', component: WorkersView, meta: { requiresAuth: true }, name: 'workers' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

const PAGE_TITLES = {
  login: 'DataForge | Вход',
  register: 'DataForge | Регистрация',
  dashboard: 'DataForge | Личный кабинет',
  search: 'DataForge | Поиск задач',
  task: 'DataForge | Страница задачи',
  workers: 'DataForge | Управление рабочими',
}

router.beforeEach((to) => {
  const { getSession } = useAuth()
  const session = getSession()

  if (to.meta.requiresAuth && !session) {
    return { name: 'login' }
  }

  if (to.meta.guest && session) {
    return { name: 'dashboard' }
  }
})

router.afterEach((to) => {
  document.title = PAGE_TITLES[to.name] || 'DataForge'
})

export default router
