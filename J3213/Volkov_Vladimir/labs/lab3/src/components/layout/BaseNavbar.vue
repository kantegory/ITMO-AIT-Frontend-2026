<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container py-2">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
        <span class="brand-badge">₽</span>
        <span>MoneyFlow</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Открыть или закрыть меню навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navMenu" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto gap-lg-2 mt-3 mt-lg-0 align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Главная</RouterLink>
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/login">Вход</RouterLink>
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">Личный кабинет</RouterLink>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/reports">Отчёт</RouterLink>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <RouterLink class="btn btn-primary rounded-pill px-4" to="/integrations">
              Интеграции
            </RouterLink>
          </li>
          <li class="nav-item theme-switch-item">
            <button class="theme-toggle-btn" type="button" @click="toggleTheme">
              <span class="theme-toggle-icon">
                <IconSprite :name="themeIcon" aria-hidden />
              </span>
              <span>{{ themeLabel }}</span>
            </button>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <button class="btn btn-outline-danger rounded-pill" type="button" @click="handleLogout">
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import IconSprite from '@/components/ui/IconSprite.vue'

const authStore = useAuthStore()
const router = useRouter()
const { themeIcon, themeLabel, toggleTheme } = useTheme()
const { showToast } = useToast()

function handleLogout() {
  authStore.logout()
  showToast('Вы вышли из аккаунта')
  router.push('/login')
}
</script>
