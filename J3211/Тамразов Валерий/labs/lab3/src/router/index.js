import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/pipelines', name: 'pipelines', component: () => import('../views/PipelinesView.vue'), meta: { requiresAuth: true } },
  { path: '/pipelines/:id', name: 'pipeline-detail', component: () => import('../views/PipelineDetailView.vue'), meta: { requiresAuth: true }, props: true },
  { path: '/environments', name: 'environments', component: () => import('../views/EnvironmentsView.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth();
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && isLoggedIn.value) {
    return { name: 'profile' };
  }
});

export default router;
