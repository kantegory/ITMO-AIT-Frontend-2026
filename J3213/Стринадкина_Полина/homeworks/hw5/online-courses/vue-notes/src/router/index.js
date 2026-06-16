import { createRouter, createWebHistory } from 'vue-router'
import NotesPage from '../views/NotesPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: NotesPage
    }
  ]
})

export default router