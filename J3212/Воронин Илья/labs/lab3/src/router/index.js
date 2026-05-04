import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '../composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'ProjectHub' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Вход — ProjectHub', guestOnly: true, hideFooter: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: 'Регистрация — ProjectHub', guestOnly: true, hideFooter: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Личный кабинет — ProjectHub', requiresAuth: true },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
    meta: { title: 'Поиск — ProjectHub', requiresAuth: true },
  },
  {
    path: '/project/:id',
    name: 'project',
    component: () => import('../views/ProjectView.vue'),
    props: true,
    meta: { title: 'Проект — ProjectHub', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && isAuthenticated()) {
    return { name: 'dashboard' };
  }
  return true;
});

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title;
});

export default router;
