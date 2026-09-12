import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import ReportsView from '../views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active', // Автоматически подсвечивает активные ссылки в меню
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/transactions', name: 'transactions', component: TransactionsView, meta: { requiresAuth: true } },
    { path: '/reports', name: 'reports', component: ReportsView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView }
  ]
})

// Глобальная защита маршрутов (вместо checkAuth)
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('app_session')
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && user) {
    next('/') // Если уже авторизован, не пускаем на логин
  } else {
    next()
  }
})

export default router