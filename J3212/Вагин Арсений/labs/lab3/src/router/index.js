import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes:[
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalog', name: 'catalog', component: () => import('../views/CatalogView.vue') },
    { path: '/collections', name: 'collections', component: () => import('../views/CollectionsView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue') },
  ]
})

export default router