import { createRouter, createWebHistory } from 'vue-router'
import NotesPage from '../views/NotesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'notes',
      component: NotesPage
    }
  ]
})

export default router