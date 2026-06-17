import { createRouter, createWebHistory } from 'vue-router'
import NotesPage from '../views/NotesPage.vue'

const routes = [
  {
    path: '/',
    name: 'Notes',
    component: NotesPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
