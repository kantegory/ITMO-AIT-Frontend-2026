import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../views/AuthPage.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterPage.vue')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardPage.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../views/SearchPage.vue')
        },
        {
            path: '/reports',
            name: 'reports',
            component: () => import('../views/ReportsPage.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/SettingsPage.vue')
        }
    ]
})

router.beforeEach((to) => {
    const authStore = useAuthStore()
    const publicPages = ['/', '/register']
    const authRequired = !publicPages.includes(to.path)

    const loggedIn = authStore.userId
    if (authRequired && !loggedIn) {
        return '/'
    }
    if (loggedIn && (to.path === '/' || to.path === '/register')) {
        return '/dashboard'
    }
})

export default router
