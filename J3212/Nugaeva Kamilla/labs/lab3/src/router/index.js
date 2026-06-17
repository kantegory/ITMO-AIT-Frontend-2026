import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import SearchPage from '../views/SearchPage.vue'
import DestinationPage from '../views/DestinationPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import CollaborationPage from '../views/CollaborationPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
  },
  {
    path: '/destination/:placeKey',
    name: 'destination',
    component: DestinationPage,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
  },
  {
    path: '/collaboration',
    name: 'collaboration',
    component: CollaborationPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

export default router