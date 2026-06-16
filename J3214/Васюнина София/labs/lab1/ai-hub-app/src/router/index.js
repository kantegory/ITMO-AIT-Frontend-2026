import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ExploreView from '@/views/ExploreView.vue'
import ModelDetailView from '@/views/ModelDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView 
    },
    { 
      path: '/explore', 
      name: 'explore', 
      component: ExploreView 
    },
    { 
      path: '/model/:modelId+', 
      name: 'model-detail', 
      component: ModelDetailView 
    },
    { 
      path: '/profile', 
      name: 'profile', 
      component: ProfileView 
    }
  ],
})

export default router