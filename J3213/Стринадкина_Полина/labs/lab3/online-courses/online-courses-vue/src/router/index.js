import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import CourseView from '../views/CourseView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import TeacherView from '../views/TeacherView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: HomeView,
    },

    {
      path: '/catalog',
      component: CatalogView,
    },

    {
      path: '/course/:id',
      component: CourseView,
    },

    {
      path: '/login',
      component: LoginView,
    },

    {
      path: '/register',
      component: RegisterView,
    },

    {
      path: '/profile',
      component: ProfileView,
    },

    {
      path: '/teacher',
      component: TeacherView,
    },
  ],
})

export default router