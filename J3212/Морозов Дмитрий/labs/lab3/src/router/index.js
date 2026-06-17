import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/experiments',
    name: 'experiments',
    component: () => import('../views/ExperimentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/experiments/:id',
    name: 'experiment-detail',
    component: () => import('../views/ExperimentDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/models',
    name: 'models',
    component: () => import('../views/ModelsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const hasToken = Boolean(localStorage.getItem('token'));

  if (to.meta.requiresAuth && !hasToken) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && hasToken) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
