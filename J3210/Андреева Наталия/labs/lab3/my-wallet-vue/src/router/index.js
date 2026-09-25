import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '/login', name: 'login', component: () => import('../views/LoginView.vue')},
        {path: '/register', name: 'register', component: () => import('../views/RegisterView.vue')},
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../views/SearchView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/reports',
            name: 'reports',
            component: () => import('../views/ReportsView.vue'),
            meta: {requiresAuth: true}
        },
        {path: '/bank', name: 'bank', component: () => import('../views/BankView.vue'), meta: {requiresAuth: true}}
    ]
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
    } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
        next('/')
    } else {
        next()
    }
})

export default router