import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import DashboardView from '@/views/DashboardView.vue';
import HomeView from '@/views/HomeView.vue';
import IntegrationsView from '@/views/IntegrationsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ReportView from '@/views/ReportView.vue';
import TransactionsView from '@/views/TransactionsView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Главная',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guestOnly: true,
      title: 'Вход',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      guestOnly: true,
      title: 'Регистрация',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: 'Личный кабинет',
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: TransactionsView,
    meta: {
      requiresAuth: true,
      title: 'Транзакции',
    },
  },
  {
    path: '/report',
    name: 'report',
    component: ReportView,
    meta: {
      requiresAuth: true,
      title: 'Отчеты',
    },
  },
  {
    path: '/integrations',
    name: 'integrations',
    component: IntegrationsView,
    meta: {
      requiresAuth: true,
      title: 'Интеграции',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  await auth.hydrateSession();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    return { name: 'dashboard' };
  }

  return true;
});

router.afterEach((to) => {
  const pageTitle = to.meta.title ? `FinTrack Pro | ${to.meta.title}` : 'FinTrack Pro | ЛР3';
  document.title = pageTitle;
});

export default router;
