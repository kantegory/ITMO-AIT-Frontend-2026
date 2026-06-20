<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useTheme } from '@/composables/useTheme.js'

const { isAuthenticated } = useAuth()
const { isDark, toggle } = useTheme()
const isMenuOpen = ref(false)

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar navbar-expand-lg site-navbar sticky-top" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand" to="/" @click="closeMenu">
        <span class="brand-mark"><i class="bi bi-globe2" /></span>
        <span>TripPlanner</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-label="Открыть меню"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" exact-active-class="active" @click="closeMenu">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/destinations" active-class="active" @click="closeMenu">Направления</RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/collaboration" active-class="active" @click="closeMenu">Совместное планирование</RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/dashboard" active-class="active" @click="closeMenu">Кабинет</RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/login" active-class="active" @click="closeMenu">Вход</RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/register" active-class="active" @click="closeMenu">Регистрация</RouterLink>
          </li>
        </ul>
        <button
          class="theme-toggle ms-lg-2"
          type="button"
          aria-label="Переключить тему"
          @click="toggle"
        >
          <i class="bi bi-moon-fill icon-moon" />
          <i class="bi bi-sun-fill icon-sun" />
        </button>
      </div>
    </div>
  </nav>
</template>
