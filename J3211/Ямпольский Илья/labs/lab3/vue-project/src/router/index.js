import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    { path: '/search', name: 'search', component: () => import('@/views/SearchPage.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardPage.vue'), meta: { requiresAuth: true } },
    { path: '/returns', name: 'returns', component: () => import('@/views/ReturnsPage.vue'), meta: { requiresAuth: true } },
    { path: '/organizer', name: 'organizer', component: () => import('@/views/OrganizerPage.vue'), meta: { requiresAuth: true, organizerOnly: true } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginPage.vue') },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterPage.vue') }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  const requiresAuth = to.meta.requiresAuth
  const organizerOnly = to.meta.organizerOnly
  const isAuthenticated = !!auth.accessToken
  const isOrganizer = auth.isOrganizer

  if (requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (organizerOnly && !isOrganizer) {
    return '/'
  }

  return true
})

export default router
