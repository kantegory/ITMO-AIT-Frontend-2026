import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CoursesView from '../views/CoursesView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import CourseDetailView from '../views/CourseDetailView.vue';

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/courses', name: 'courses', component: CoursesView },
    { path: '/course/:id', name: 'course-detail', component: CourseDetailView, props: true },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { 
        path: '/dashboard', 
        name: 'dashboard', 
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    }
});

router.beforeEach((to, from) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (to.meta.requiresAuth && !user) {
        return '/login';
    }
});

export default router;