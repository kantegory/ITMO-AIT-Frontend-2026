import {createRouter, createWebHistory} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CatalogView from '../views/CatalogView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '/', name: 'catalog', component: CatalogView},
        {path: '/login', component: () => import('../views/LoginView.vue')},
        {path: '/course/:id', component: () => import('../views/CourseView.vue')},
        {path: '/profile', component: () => import('../views/ProfileView.vue')},
        {path: '/teacher', component: () => import('../views/TeacherView.vue')},
        {path: '/register', name: 'register', component: () => import('../views/RegisterView.vue')},
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const publicPages = ['/', '/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = authStore.user;

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    if (to.path === '/teacher' && loggedIn?.role !== 'teacher') {
        alert("Доступ запрещен!")
        return next('/profile')
    }

    next();
});

router.afterEach(() => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

export default router
