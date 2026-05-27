import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue'), meta: { auth: true } },
  { path: '/transactions', component: () => import('../views/TransactionsView.vue'), meta: { auth: true } },
  { path: '/accounts', component: () => import('../views/AccountsView.vue'), meta: { auth: true } },
  { path: '/reports', component: () => import('../views/ReportsView.vue'), meta: { auth: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isLoggedIn) return '/login'
  if (to.meta.guest && auth.isLoggedIn) return '/dashboard'
})

export default router
