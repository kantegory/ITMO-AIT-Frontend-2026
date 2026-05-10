<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <span class="text-warning">M</span>inion Courses
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarContent" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/courses">Курсы</RouterLink>
          </li>
          <li v-if="auth.user?.role === 'teacher'" class="nav-item">
            <RouterLink class="nav-link" to="/teacher">Кабинет</RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="toggleTheme">
            <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>

          <template v-if="auth.isLoggedIn">
            <RouterLink class="btn btn-outline-primary btn-sm" to="/profile">
              <i class="bi bi-person-circle me-1"></i>{{ auth.user?.name }}
            </RouterLink>
            <button class="btn btn-outline-danger btn-sm" @click="handleLogout">Выйти</button>
          </template>
          <template v-else>
            <RouterLink class="btn btn-outline-primary btn-sm" to="/login">Войти</RouterLink>
            <RouterLink class="btn btn-warning btn-sm" to="/register">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { theme, toggleTheme } = useTheme()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
