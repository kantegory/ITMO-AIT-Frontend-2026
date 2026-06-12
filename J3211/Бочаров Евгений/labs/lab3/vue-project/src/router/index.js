import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth, getCurrentUser, hasRole } from '@/composables/useAuth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/event/:id',
        name: 'EventDetail',
        component: () => import('@/views/EventDetailView.vue'),
        props: true
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/organizer',
        name: 'Organizer',
        component: () => import('@/views/OrganizerView.vue'),
        meta: { requiresAuth: true, role: 'organizer' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = checkAuth()

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    if (to.meta.guestOnly && isAuthenticated) {
        return next({ name: 'Home' })
    }
    if (to.meta.role && !hasRole(to.meta.role)) {
        return next({ name: 'Home' })
    }
    next()
})

export default router