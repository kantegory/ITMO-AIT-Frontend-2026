import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('../views/DashboardPage.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginPage.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterPage.vue') },
    { path: '/transactions', name: 'transactions', component: () => import('../views/TransactionsPage.vue') },
    { path: '/integrations', name: 'integrations', component: () => import('../views/IntegrationsPage.vue') },
    { path: '/reports', name: 'reports', component: () => import('../views/ReportsPage.vue') }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userName'); 
  if (to.name !== 'login' && to.name !== 'register' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router