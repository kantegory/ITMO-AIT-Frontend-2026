import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import TransactionsPage from '../pages/TransactionsPage.vue'
import ReportsPage from '../pages/ReportsPage.vue'
import IntegrationsPage from '../pages/IntegrationsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/register', name: 'register', component: RegisterPage },
    { path: '/dashboard', name: 'dashboard', component: DashboardPage },
    { path: '/transactions', name: 'transactions', component: TransactionsPage },
    { path: '/reports', name: 'reports', component: ReportsPage },
    { path: '/integrations', name: 'integrations', component: IntegrationsPage },
  ],
})

export default router