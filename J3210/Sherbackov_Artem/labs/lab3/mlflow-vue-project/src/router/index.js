import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeLayout from '@/layouts/HomeLayout.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: HomeLayout, requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments',
    name: 'Experiments',
    component: () => import('@/views/ExperimentsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/:id',
    name: 'ExperimentEntity',
    component: () => import('@/views/ExperimentEntityView.vue'),
    meta: { requiresAuth: true }
  },
    {
    path: '/runs/:id',
    name: 'RunEntity',
    component: () => import('@/views/RunEntityView.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/modelss',
    name: 'Models',
    component: () => import('@/views/ModelsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/modelss/:id',
    name: 'ModelEntity',
    component: () => import('@/views/ModelEntityView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;