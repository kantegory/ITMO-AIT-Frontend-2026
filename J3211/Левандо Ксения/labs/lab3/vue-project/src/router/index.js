import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import EventsView from "@/views/EventsView.vue";
import EventView from "@/views/EventView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue"
import OrganizerLoginView from "@/views/OrganizerLoginView.vue";
import OrganizerDashboardView from "@/views/OrganizerDashboardView.vue";
import UserDashboardView from "@/views/UserDashboardView.vue";

const routes = [
    { path: "/", component: HomeView },
    { path: "/events", component: EventsView  },
    { path: "/event/:id", component: EventView },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/organizer-login", component: OrganizerLoginView },
    { path: "/organizer-dashboard", component: OrganizerDashboardView },
    { path: "/dashboard", component: UserDashboardView}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;