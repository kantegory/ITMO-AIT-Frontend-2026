import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const DashboardView = () => import('../views/DashboardView.vue');
const PipelinesView = () => import('../views/PipelinesView.vue');
const PipelineDetailsView = () => import('../views/PipelineDetailsView.vue');
const MonitoringView = () => import('../views/MonitoringView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { public: true } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/pipelines', name: 'pipelines', component: PipelinesView },
    { path: '/pipelines/:id', name: 'pipeline-details', component: PipelineDetailsView, props: true },
    { path: '/monitoring', name: 'monitoring', component: MonitoringView },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
  ]
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (!to.meta.public && !isAuthenticated.value) return '/';
  if (to.meta.public && isAuthenticated.value) return '/dashboard';
  return true;
});

export default router;
