<script setup>
import { useRouter } from "vue-router";
import SvgIcon from "./SvgIcon.vue";
import { logout } from "../session.js";

const router = useRouter();
const links = [
    { to: "/dashboard", title: "Dashboard" },
    { to: "/explore", title: "Explore" },
    { to: "/models", title: "My Models" },
    { to: "/datasets", title: "My Datasets" },
    { to: "/subscriptions", title: "Subscriptions" },
    { to: "/settings", title: "Settings" }
];

function signOut() {
    logout();
    router.push("/login");
}
</script>

<template>
    <aside class="sidebar">
        <div class="brand mb-4">DataPort</div>
        <nav class="nav flex-column" aria-label="Основная навигация">
            <RouterLink v-for="link in links" :key="link.to" class="nav-link" active-class="active" :to="link.to">{{ link.title }}</RouterLink>
            <hr>
            <button class="nav-link text-danger text-start border-0 bg-transparent" type="button" @click="signOut"><SvgIcon name="logout" />Выход</button>
        </nav>
    </aside>
</template>
