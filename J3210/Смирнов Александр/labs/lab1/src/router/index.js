import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue")
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("../views/ProfileView.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/model/:id",
        name: "model",
        component: () => import("../views/ModelView.vue"),
        props: true
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("../views/NotFoundView.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {
    const { isLoggedIn } = useAuth();
    if (to.meta.requiresAuth && !isLoggedIn.value) {
        return { name: "login", query: { redirect: to.fullPath } };
    }
    if (isLoggedIn.value && (to.name === "login" || to.name === "register")) {
        return { name: "profile" };
    }
    return true;
});

export default router;
