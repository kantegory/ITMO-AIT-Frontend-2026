<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, isAuthenticated, logout } = useAuth()

const authLabel = computed(() => currentUser.value?.name || 'Вход')

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg navbar-dark" aria-label="Основная навигация">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
          <svg class="icon-inline" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-wallet"></use>
          </svg>
          <span>Finance Manager</span>
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNav"
                aria-controls="appNav" aria-expanded="false" aria-label="Открыть меню">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="appNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/dashboard">Кабинет</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/transactions">Транзакции</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/report">Отчёт</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/integrations">Интеграции</RouterLink>
            </li>
            <li class="nav-item">
              <ThemeToggle />
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <RouterLink class="btn btn-sm btn-outline-light" to="/login">{{ authLabel }}</RouterLink>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <RouterLink class="btn btn-sm btn-warning" to="/register">Регистрация</RouterLink>
            </li>
            <li class="nav-item" v-else>
              <RouterLink class="btn btn-sm btn-outline-light" to="/dashboard">{{ authLabel }}</RouterLink>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <button class="btn btn-sm btn-warning" type="button" @click="handleLogout">Выйти</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
