import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
const routes = [
  { path: '/',              redirect: '/dashboard' },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true, title: 'Вход' },
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true, title: 'Регистрация' },
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Кабинет' },
  },
  {
    path: '/search',
    component: () => import('@/views/SearchView.vue'),
    meta: { requiresAuth: true, title: 'Поиск направлений' },
  },
  {
    path: '/destination/:id',
    component: () => import('@/views/DestinationView.vue'),
    meta: { requiresAuth: true, title: 'Направление' },
  },
  {
    path: '/collab',
    component: () => import('@/views/CollabView.vue'),
    meta: { requiresAuth: true, title: 'Совместное планирование' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
router.beforeEach(to => {
  const { isLoggedIn } = useAuth()
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { path: '/login' }
  }
  if (to.meta.requiresGuest && isLoggedIn.value) {
    return { path: '/dashboard' }
  }
})
router.afterEach(to => {
  document.title = to.meta.title
    ? `Wanderlust — ${to.meta.title}`
    : 'Wanderlust'
})

export default router
