<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const { currentUser, isAuthenticated } = storeToRefs(authStore);

function logout() {
  authStore.logout();
  router.push("/");
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark site-navbar">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/">Маршрут</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Открыть меню"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="main-nav" class="collapse navbar-collapse">
          <div class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <RouterLink class="nav-link" to="/">Направления</RouterLink>
            <RouterLink v-if="isAuthenticated" class="nav-link" to="/trip">Моя поездка</RouterLink>
            <RouterLink class="nav-link" to="/about">О проекте</RouterLink>
            <RouterLink v-if="isAuthenticated" class="nav-link" to="/profile">
              {{ currentUser.firstName }}
            </RouterLink>
            <RouterLink v-else class="btn btn-outline-light btn-sm ms-lg-2" to="/login">
              Войти
            </RouterLink>
            <button v-if="isAuthenticated" class="btn btn-outline-light btn-sm ms-lg-2" @click="logout">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1">
      <slot />
    </main>

    <footer class="site-footer py-4 mt-auto">
      <div class="container d-flex flex-wrap justify-content-between gap-2">
        <span>«Маршрут» — учебный проект на Vue 3</span>
        <span>Лесовой Никита · вариант 3</span>
      </div>
    </footer>
  </div>
</template>
