import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/register', component: () => import('../views/RegisterView.vue') },
    { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/agents', component: () => import('../views/AgentsView.vue') },
    { path: '/simulation', component: () => import('../views/SimulationView.vue') }
  ]
})

export default router
