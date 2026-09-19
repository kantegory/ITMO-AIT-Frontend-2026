import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from './composables/useAuth';
import AuthPage from './views/AuthPage.vue';
import DashboardPage from './views/DashboardPage.vue';
import SearchPage from './views/SearchPage.vue';
import ExperimentPage from './views/ExperimentPage.vue';
import ModelsPage from './views/ModelsPage.vue';
import NotFoundPage from './views/NotFoundPage.vue';
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: AuthPage, props: { mode: 'login' }, meta: { public: true } },
  { path: '/register', component: AuthPage, props: { mode: 'register' }, meta: { public: true } },
  { path: '/dashboard', component: DashboardPage },
  { path: '/search', component: SearchPage },
  { path: '/experiments/:id', component: ExperimentPage },
  { path: '/models', component: ModelsPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage }
] });
router.beforeEach(to => {
  const { session } = useAuth();
  if (!to.meta.public && !session.value) return '/login';
  if (to.meta.public && session.value) return '/dashboard';
});
export default router;
