import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import TransactionsView from '../views/TransactionsView.vue';
import ReportsView from '../views/ReportsView.vue';
import IntegrationsView from '../views/IntegrationsView.vue';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', redirect: () => (useAuth().isAuthenticated.value ? '/dashboard' : '/login') },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true, title: 'Вход' } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true, title: 'Регистрация' } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true, title: 'Личный кабинет' } },
  { path: '/transactions', name: 'transactions', component: TransactionsView, meta: { requiresAuth: true, title: 'Транзакции' } },
  { path: '/reports', name: 'reports', component: ReportsView, meta: { requiresAuth: true, title: 'Отчёты' } },
  { path: '/integrations', name: 'integrations', component: IntegrationsView, meta: { requiresAuth: true, title: 'Интеграции' } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  document.title = `Tarelka — ${to.meta.title || 'SPA'}`;

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
