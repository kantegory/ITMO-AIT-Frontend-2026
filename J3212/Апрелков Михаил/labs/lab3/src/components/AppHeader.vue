<template>
  <header>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-white border-bottom"
      aria-label="Основная навигация"
    >
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/search">
          <i class="bi bi-compass text-primary me-2"></i>
          Tripatropa
        </RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/search">Поиск</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/profile">Профиль</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/collaboration">
                Совместное планирование
              </RouterLink>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <ThemeToggle />
            <button
              v-if="isAuthenticated"
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="onLogout"
            >
              Выйти
            </button>
            <RouterLink v-else to="/login" class="btn btn-outline-primary btn-sm">
              Войти
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import ThemeToggle from "./ThemeToggle.vue";
import { useAuth } from "../composables/useAuth.js";

const { isAuthenticated, logout } = useAuth();
const router = useRouter();

function onLogout() {
  logout();
  router.push("/login");
}
</script>
