import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/views/ForgotPasswordView.vue'), meta: { guestOnly: true } },
  { path: '/account', name: 'account', component: () => import('@/views/AccountView.vue'), meta: { requiresAuth: true } },
  { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
  {
    path: '/add-bank-account',
    name: 'add-bank-account',
    component: () => import('@/views/AddBankAccountView.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'account' }
  }

  return true
})

export default router
