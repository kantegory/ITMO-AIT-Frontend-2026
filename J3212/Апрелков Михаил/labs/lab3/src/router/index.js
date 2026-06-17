import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import DestinationView from "../views/DestinationView.vue";
import CollaborationView from "../views/CollaborationView.vue";

const routes = [
  { path: "/", redirect: "/search" },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/profile", name: "profile", component: ProfileView },
  { path: "/search", name: "search", component: SearchView },
  {
    path: "/destinations/:id",
    name: "destination",
    component: DestinationView,
    props: true
  },
  { path: "/collaboration", name: "collaboration", component: CollaborationView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
