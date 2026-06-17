<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggleButton from '@/components/ThemeToggleButton.vue'

const baseUrl = import.meta.env.BASE_URL

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.clearSession()
  router.push({ name: 'login' })
}

function isCurrent(name) {
  return route.name === name
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-custom mb-4 shadow-sm" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand navbar-brand-custom" :to="{ name: 'account' }">
        <span class="brand-logo-wrap" aria-hidden="true">
          <svg class="brand-logo" viewBox="0 0 24 24" aria-hidden="true">
            <use :href="`${baseUrl}img/sprite.svg#icon-money`" />
          </svg>
        </span>
        <span class="brand-title">Мои прекрасные расходы</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Переключить меню навигации"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link nav-link-custom" :class="{ active: isCurrent('account') }" :to="{ name: 'account' }">
              Обзор
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link nav-link-custom" :class="{ active: isCurrent('search') }" :to="{ name: 'search' }">
              Транзакции
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link nav-link-custom"
              :class="{ active: isCurrent('dashboard') }"
              :to="{ name: 'dashboard' }"
            >
              Отчёты
            </RouterLink>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-3">
          <ThemeToggleButton />
          <span id="userEmail" aria-live="polite">{{ authStore.user?.email || 'Загрузка...' }}</span>
          <button id="logoutButton" type="button" class="btn btn-outline-secondary btn-sm fw-bold" @click="logout">Выйти</button>
        </div>
      </div>
    </div>
  </nav>
</template>
