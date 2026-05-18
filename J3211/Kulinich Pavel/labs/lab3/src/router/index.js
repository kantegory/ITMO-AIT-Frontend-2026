import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import SearchView from '../views/SearchView.vue';
import EventView from '../views/EventView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import OrganizerView from '../views/OrganizerView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchView },
  { path: '/event/:id', name: 'event', component: EventView, props: true },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/organizer', name: 'organizer', component: OrganizerView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
