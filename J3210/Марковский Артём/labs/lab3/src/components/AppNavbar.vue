<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authState, clearSession } from '@/stores/auth.js'
import { useTheme } from '@/composables/useTheme.js'

const router = useRouter()
const route = useRoute()
const { theme, toggleTheme } = useTheme()

const isAuth = computed(() => authState.isAuth)
const userName = computed(() => authState.userName)
const isDark = computed(() => theme.value === 'dark')

function logout() {
  clearSession()
  router.push({ name: 'login' })
}

function isActive(routeName) {
  if (routeName === 'projects') return route.name === 'project' || route.name === 'dashboard'
  return route.name === routeName
}
</script>

<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg app-navbar" :aria-label="isAuth ? 'Навигация по приложению' : 'Основная навигация'">
      <div class="container">
        <div class="app-navbar-start">
          <RouterLink class="navbar-brand app-brand" :to="isAuth ? '/dashboard' : '/'">TaskHub</RouterLink>
          <button
            class="btn btn-light btn-sm theme-toggle"
            type="button"
            aria-label="Переключить тему"
            :aria-pressed="isDark"
            :title="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
            @click="toggleTheme"
          >
            <svg class="app-icon" aria-hidden="true">
              <use :href="isDark ? '/assets/icons.svg#icon-sun' : '/assets/icons.svg#icon-moon'"></use>
            </svg>
            <span class="button-text">{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
          </button>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNav"
          aria-controls="appNav"
          aria-expanded="false"
          aria-label="Меню"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="appNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <template v-if="!isAuth">
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('login') }" to="/">Вход</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('register') }" to="/register">Регистрация</RouterLink>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('dashboard') }" to="/dashboard">Личный кабинет</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('projects') }" to="/dashboard">Проекты</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('search') }" to="/search">Поиск</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :class="{ active: isActive('faq') }" to="/faq">Справка</RouterLink>
              </li>
              <li class="nav-item user-chip" aria-label="Текущий пользователь">
                <span>{{ userName }}</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-light btn-sm logout-link" type="button" aria-label="Выйти из аккаунта" @click="logout">
                  <svg class="app-icon" aria-hidden="true"><use href="/assets/icons.svg#icon-log-out"></use></svg>
                  <span>Выйти</span>
                </button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
