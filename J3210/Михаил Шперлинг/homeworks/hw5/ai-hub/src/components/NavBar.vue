<script setup>
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { isDark, toggle: toggleTheme } = useTheme()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top" aria-label="Главная навигация">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">AI Hub</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Переключатель навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" :class="{ active: $route.name === 'models' }">
              Модели
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/datasets" :class="{ active: $route.name === 'datasets' }">
              Датасеты
            </router-link>
          </li>
        </ul>

        <button
          @click="toggleTheme"
          class="btn btn-link text-light me-3 p-0 border-0"
          aria-label="Переключить тему"
        >
          <svg class="svg-icon" aria-hidden="true">
            <use :href="isDark ? '/sprite.svg#icon-sun' : '/sprite.svg#icon-moon'"></use>
          </svg>
        </button>

        <div class="d-flex align-items-center gap-2">
          <template v-if="authStore.isLoggedIn">
            <span class="text-light fw-bold">@{{ authStore.user.username }}</span>
            <router-link to="/profile" class="btn btn-secondary" aria-label="Личный кабинет">
              <svg class="svg-icon" aria-hidden="true"><use href="/sprite.svg#icon-person"></use></svg>
            </router-link>
            <button @click="logout" class="btn btn-outline-danger">Выйти</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-light">Вход</router-link>
            <router-link to="/register" class="btn btn-primary">Регистрация</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
