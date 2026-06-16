import { createRouter, createWebHistory } from 'vue-router';
import { getSavedToken } from '../composables/useAuth';
import DashboardView from '../views/DashboardView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import RegisterView from '../views/RegisterView.vue';
import TaskView from '../views/TaskView.vue';
import WorkersView from '../views/WorkersView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/projects',
        name: 'projects',
        component: ProjectsView
    },
    {
        path: '/task',
        name: 'task',
        component: TaskView
    },
    {
        path: '/workers',
        name: 'workers',
        component: WorkersView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !getSavedToken()) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    }

    return true;
});

export default router;
