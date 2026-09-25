<template>
  <div>
    <header>
      <nav class="navbar-terminal" aria-label="Основное меню">
        <div class="navbar-brand" role="heading" aria-level="1">[ СИСТЕМА_СЧЁТ ]</div>
        <button class="menu-toggle-btn" @click="toggleMenu" aria-label="Открыть мобильное меню">[ МЕНЮ ]</button>

        <div class="nav-links" :class="{ 'active': isMenuOpen }">
          <button class="menu-close-btn" @click="toggleMenu" aria-label="Закрыть меню">[ X ]</button>

          <router-link to="/dashboard" @click="closeMenu">ГЛАВНАЯ</router-link>
          <router-link to="/search" @click="closeMenu">ПОИСК</router-link>
          <router-link to="/reports" @click="closeMenu">ОТЧЁТЫ</router-link>
          <router-link to="/settings" @click="closeMenu">НАСТРОЙКИ</router-link>

          <a href="#" @click.prevent="toggleTheme" aria-label="Переключить цветовую тему">
            {{ theme === 'light' ? '[ DARK_MODE ]' : '[ LIGHT_MODE ]' }}
          </a>
          <a href="#" @click.prevent="handleLogout" aria-label="Выйти из системы">[ ВЫХОД ]</a>
        </div>
      </nav>
    </header>

    <div class="menu-overlay" :class="{ 'active': isMenuOpen }" @click="closeMenu"></div>

    <main id="main-content">
      <slot/>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'

const authStore = useAuthStore()
const router = useRouter()

const { theme, toggleTheme, initTheme } = useTheme()
const isMenuOpen = ref(false)
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const closeMenu = () => isMenuOpen.value = false
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  initTheme()
})
</script>