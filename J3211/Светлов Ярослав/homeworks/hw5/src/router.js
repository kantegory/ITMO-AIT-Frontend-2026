import { createRouter, createWebHashHistory } from 'vue-router';
import NotesPage from './views/NotesPage.vue';
import NewNotePage from './views/NewNotePage.vue';
export default createRouter({ history: createWebHashHistory(), routes: [
  { path: '/', component: NotesPage },
  { path: '/new', component: NewNotePage },
  { path: '/:pathMatch(.*)*', redirect: '/' }
] });
