<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </symbol>
    <symbol id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </symbol>
    <symbol id="icon-logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </symbol>
    <symbol id="icon-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </symbol>
    <symbol id="icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </symbol>
    <symbol id="icon-dashboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
    </symbol>
    <symbol id="icon-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><circle cx="11" cy="11" r="2"></circle>
    </symbol>
    <symbol id="icon-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </symbol>
    <symbol id="icon-teacher" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </symbol>
  </svg>

  <aside class="sidebar" role="navigation" aria-label="Главное меню">
    <div class="logo-wrap">
      <router-link to="/" class="logo text-decoration-none">
        <span class="logo-mark">L</span>
        <span class="logo-text">Learnify</span>
      </router-link>
    </div>

    <nav class="sidebar-nav" aria-label="Меню кабинета">
      <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }" aria-current="page">
        <svg class="nav-icon" aria-hidden="true" width="20" height="20"><use href="#icon-dashboard"></use></svg>
        <span>Мой кабинет</span>
      </router-link>
      <router-link to="/dashboard#myCoursesSection" class="nav-item">
        <svg class="nav-icon" aria-hidden="true" width="20" height="20"><use href="#icon-book"></use></svg>
        <span>Моё обучение</span>
      </router-link>
      <router-link to="/dashboard#createdCoursesSection" class="nav-item">
        <svg class="nav-icon" aria-hidden="true" width="20" height="20"><use href="#icon-pen"></use></svg>
        <span>Мои курсы</span>
      </router-link>
      <router-link to="/dashboard#certificatesSection" class="nav-item">
        <svg class="nav-icon" aria-hidden="true" width="20" height="20"><use href="#icon-trophy"></use></svg>
        <span>Сертификаты</span>
      </router-link>
      <router-link to="/" class="nav-item">
        <svg class="nav-icon" aria-hidden="true" width="20" height="20"><use href="#icon-folder"></use></svg>
        <span>Все курсы</span>
      </router-link>
    </nav>

    <div class="sidebar-bottom">
      <button class="theme-toggle" type="button" @click="theme.toggle()" :aria-label="theme.theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'">
        <svg v-if="theme.theme === 'dark'" class="theme-toggle-icon" aria-hidden="true" width="20" height="20"><use href="#icon-sun"></use></svg>
        <svg v-else class="theme-toggle-icon" aria-hidden="true" width="20" height="20"><use href="#icon-moon"></use></svg>
        <span class="theme-toggle-text">{{ theme.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}</span>
      </button>

      <button class="logout-btn" @click="handleLogout">
        <svg aria-hidden="true" width="20" height="20"><use href="#icon-logout"></use></svg>
        <span>Выйти</span>
      </button>
    </div>
  </aside>
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