<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";
import { useToast } from "@/composables/useToast.js";
import Icon from "@/components/ui/Icon.vue";
import ThemeToggle from "@/components/layout/ThemeToggle.vue";

const router = useRouter();
const { isAuthenticated, currentUsername, logout } = useAuth();
const toast = useToast();

function handleLogout() {
    logout();
    toast.info("Вы вышли из аккаунта");
    router.push({ name: "login" });
}
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-themed">
            <div class="container">
                <RouterLink class="navbar-brand d-inline-flex align-items-center gap-2" :to="{ name: 'home' }">
                    <Icon name="artifactCube" class="icon icon--brand" />
                    PipelineLab
                </RouterLink>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu"
                    aria-controls="navbarMenu"
                    aria-expanded="false"
                    aria-label="Открыть меню навигации"
                >
                    <span class="navbar-toggler-icon" aria-hidden="true"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarMenu">
                    <div class="navbar-nav ms-auto align-items-lg-center flex-lg-row gap-lg-1">
                        <RouterLink class="nav-link" :to="{ name: 'home' }">Главная</RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'dashboard' }" v-if="isAuthenticated">
                            Личный кабинет
                        </RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'experiments' }" v-if="isAuthenticated">
                            Эксперименты
                        </RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'models' }" v-if="isAuthenticated">
                            Модели
                        </RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'datasets' }" v-if="isAuthenticated">
                            Датасеты
                        </RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'login' }" v-if="!isAuthenticated">
                            Вход
                        </RouterLink>
                        <span class="nav-link" v-if="isAuthenticated" style="cursor: default; opacity: 0.85">
                            {{ currentUsername }}
                        </span>
                        <button
                            v-if="isAuthenticated"
                            type="button"
                            class="nav-link btn btn-link text-start"
                            style="text-decoration: none"
                            @click="handleLogout"
                        >
                            Выйти
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
