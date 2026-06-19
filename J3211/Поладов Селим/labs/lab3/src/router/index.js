import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import ReportsView from '../views/ReportsView.vue'
import IntegrationView from '../views/IntegrationView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', component: LandingView, meta: { guest: true } },
  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/register', component: RegisterView, meta: { guest: true } },
  { path: '/dashboard', component: DashboardView, meta: { auth: true } },
  { path: '/transactions', component: TransactionsView, meta: { auth: true } },
  { path: '/reports', component: ReportsView, meta: { auth: true } },
  { path: '/integration', component: IntegrationView, meta: { auth: true } },
  { path: '/settings', component: SettingsView, meta: { auth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.auth && !isAuthenticated.value) return '/login'
  if (to.meta.guest && isAuthenticated.value && to.path !== '/') return '/dashboard'
})
