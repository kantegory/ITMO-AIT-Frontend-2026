<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </symbol>
    <symbol id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </symbol>
  </svg>

  <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>

  <nav class="navbar navbar-expand-lg sticky-top" aria-label="Основная навигация">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/" aria-label="Learnify — на главную">Learnify</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#mainNavbar" aria-controls="mainNavbar"
              aria-expanded="false" aria-label="Открыть меню">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">Главная</router-link>
          </li>
          <template v-if="auth.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/dashboard' }" to="/dashboard">Моё обучение</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/teacher' }" to="/teacher">Создать курс</router-link>
            </li>
          </template>
        </ul>

        <div class="d-flex align-items-center gap-2 ms-lg-3">
          <button class="theme-toggle" type="button" @click="theme.toggle()" :aria-label="theme.theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'">
            <span class="theme-toggle-icon">
              <svg v-if="theme.theme === 'dark'" aria-hidden="true" width="20" height="20"><use href="#icon-sun"></use></svg>
              <svg v-else aria-hidden="true" width="20" height="20"><use href="#icon-moon"></use></svg>
            </span>
          </button>

          <span v-if="auth.isAuthenticated" class="small navbar-user-name">{{ auth.userName }}</span>

          <template v-if="auth.isAuthenticated">
            <button @click="handleLogout" class="btn btn-outline-custom btn-sm">Выход</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-custom btn-sm">Вход</router-link>
            <router-link to="/register" class="btn btn-primary-custom btn-sm">Регистрация</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
