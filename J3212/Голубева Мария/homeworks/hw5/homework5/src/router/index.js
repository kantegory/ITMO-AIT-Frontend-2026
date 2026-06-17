import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import CoursesPage from '../views/CoursesPage.vue'
import CabinetPage from '../views/CabinetPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/courses', component: CoursesPage },
    { path: '/cabinet', component: CabinetPage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage }
  ]
})

export default router