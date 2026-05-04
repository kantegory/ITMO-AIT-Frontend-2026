import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import CoursesPage from '../views/CoursesPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import CabinetPage from '../views/CabinetPage.vue'
import CoursePage from '../views/CoursePage.vue'
import AboutPage from '../views/AboutPage.vue'
import ContactsPage from '../views/ContactsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/courses', component: CoursesPage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/cabinet', component: CabinetPage },
    { path: '/courses/:id', component: CoursePage },
    { path: '/about', component: AboutPage },
    { path: '/contacts', component: ContactsPage },
  ],
})

export default router