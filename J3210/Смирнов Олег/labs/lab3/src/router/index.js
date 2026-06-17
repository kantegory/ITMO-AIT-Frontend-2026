import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/models',
    name: 'models',
    component: () => import('@/views/SearchView.vue'),
    props: { type: 'models' },
  },
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/SearchView.vue'),
    props: { type: 'datasets' },
  },
  {
    path: '/models/:id',
    name: 'model-detail',
    component: () => import('@/views/ModelDetailView.vue'),
    props: true,
  },
  {
    path: '/datasets/:id',
    name: 'dataset-detail',
    component: () => import('@/views/DatasetDetailView.vue'),
    props: true,
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

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'dashboard' };
  }
});

export default router;
