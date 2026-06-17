import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/stores'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/courses',
        },
        {
            path: '/courses',
            name: 'courses',
            component: () => import('@/views/CoursesView.vue'),
        },
        {
            path: '/courses/:id',
            name: 'course',
            component: () => import('@/views/CourseView.vue'),
            props: true,
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: {
                guestOnly: true,
            },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: {
                guestOnly: true,
            },
        },
        {
            path: '/my-courses',
            name: 'my-courses',
            component: () => import('@/views/MyCoursesView.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/my-learning',
            name: 'my-learning',
            component: () => import('@/views/MyLearningView.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/lesson/:id',
            name: 'lesson',
            component: () => import('@/views/LessonView.vue'),
            props: true,
            meta: {
                requiresAuth: true,
            },
        },
    ],
})

router.beforeEach((to) => {
    const sessionStore = useSessionStore(pinia)

    if (to.meta.requiresAuth && !sessionStore.isAuthenticated) {
        return '/login'
    }

    if (to.meta.guestOnly && sessionStore.isAuthenticated) {
        return '/courses'
    }

    return true
})

export default router
