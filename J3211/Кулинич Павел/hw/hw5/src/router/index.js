import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ProfileView from '../views/ProfileView.vue'
import OrganizerView from '../views/OrganizerView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/search', component: SearchView },
    { path: '/profile', component: ProfileView },
    { path: '/organizer', component: OrganizerView }
  ]
})

export default router