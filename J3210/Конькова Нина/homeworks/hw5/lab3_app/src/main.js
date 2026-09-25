import { useTheme } from './composables/useTheme.js';
import { useAuth } from './composables/useAuth.js';
import ToastHost from './components/ToastHost.js';
import HomeView from './views/HomeView.js';
import LoginView from './views/LoginView.js';
import RegisterView from './views/RegisterView.js';
import DashboardView from './views/DashboardView.js';
import ExperimentsView from './views/ExperimentsView.js';
import ExperimentDetailView from './views/ExperimentDetailView.js';
import ModelsView from './views/ModelsView.js';
import ArtifactsView from './views/ArtifactsView.js';

const { createApp } = window.Vue;
const { createRouter, createWebHashHistory } = window.VueRouter;

useTheme().initTheme();

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/home', component: HomeView, meta: { title: 'MLOps Flow' } },
    { path: '/login', component: LoginView, meta: { guestOnly: true, title: 'Login - MLOps Flow' } },
    { path: '/register', component: RegisterView, meta: { guestOnly: true, title: 'Registration - MLOps Flow' } },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true, title: 'Dashboard - MLOps Flow' } },
    { path: '/experiments', component: ExperimentsView, meta: { requiresAuth: true, title: 'Experiments - MLOps Flow' } },
    { path: '/experiments/:id', component: ExperimentDetailView, meta: { requiresAuth: true, title: 'Experiment Details - MLOps Flow' } },
    { path: '/models', component: ModelsView, meta: { requiresAuth: true, title: 'Models - MLOps Flow' } },
    { path: '/artifacts', component: ArtifactsView, meta: { requiresAuth: true, title: 'Artifacts - MLOps Flow' } },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to) => {
    const { isAuthenticated } = useAuth();

    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        };
    }

    if (to.meta.guestOnly && isAuthenticated.value) {
        return '/dashboard';
    }

    return true;
});

router.afterEach((to) => {
    document.title = to.meta.title || 'MLOps Flow';
});

const App = {
    components: {
        ToastHost
    },
    template: `
        <RouterView />
        <ToastHost />
    `
};

createApp(App).use(router).mount('#app');
