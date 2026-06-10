<template>
  <nav class="navbar navbar-expand-lg navbar-light sticky-top shadow-sm" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/" aria-label="AIBloom, перейти на главную страницу">
        <svg class="brand-flower ui-icon ui-icon-lg" aria-hidden="true">
          <use href="/sprite.svg#icon-flower"></use>
        </svg>
        <span class="ms-2">AIBloom</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon" aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto align-items-center">
          <RouterLink class="nav-link mx-2" to="/">Поиск</RouterLink>

          <!-- Авторизован -->
          <template v-if="currentUser">
            <RouterLink class="nav-link mx-2" to="/profile">Профиль</RouterLink>

            <span class="nav-link mx-2 user-badge">
              <svg class="ui-icon me-1" aria-hidden="true" width="14" height="14">
                <use href="/sprite.svg#icon-flower"></use>
              </svg>
              {{ currentUser.name }}
            </span>

            <button class="btn btn-sm btn-outline-secondary ms-2" @click="handleLogout">
              Выйти
            </button>
          </template>

          <!-- Не авторизован -->
          <template v-else>
            <RouterLink class="nav-link mx-2" to="/login">Вход</RouterLink>
            <RouterLink class="btn btn-accent ms-lg-3 shadow-sm" to="/register">
              Создать сад
            </RouterLink>
          </template>

          <ThemeToggle class="ms-2" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

import ThemeToggle from '@/components/ThemeToggle.vue'
import { currentUser, useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth(router)

function handleLogout() {
  logout(router)
}
</script>

<style scoped>
.user-badge {
  font-weight: 500;
  color: var(--bloom-green);
  display: flex;
  align-items: center;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
