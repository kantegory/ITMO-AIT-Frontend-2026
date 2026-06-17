<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

function handleAuthAction() {
  if (authStore.isAuthenticated) {
    authStore.logout()
    router.push('/login')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <header class="navbar navbar-expand-md">
    <div class="container-fluid">
      
      <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Открыть боковое меню">
        <span class="navbar-toggler-icon"></span>
      </button>

      <router-link class="navbar-brand d-none d-md-inline" to="/">
        <h2 class="fw-bolder"> MLShare </h2>
      </router-link>
      
      <div class="dropdown ms-auto">
        <button class="btn p-0 border-0 bg-transparent d-flex align-items-center text-contrast text-decoration-none dropdown-toggle" id="userMenuToggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Открыть меню пользователя">
          <img src="https://placekittens.com/32/32" alt="Аватар пользователя" width="32" height="32" class="rounded-circle me-2">
          <span>{{ authStore.displayName }}</span>
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark shadow" id="userMenuDropdown">
          <template v-if="authStore.isAuthenticated">
            <li><router-link class="dropdown-item" to="/">Личный кабинет</router-link></li>
            <li><a class="dropdown-item" href="#">Настройки</a></li>
            <li><hr class="dropdown-divider"></li>
          </template>
          
          <li>
            <button class="dropdown-item" type="button" @click="themeStore.setTheme('light')" :class="{ active: themeStore.currentTheme === 'light' }">Светлая</button>
          </li>
          <li>
            <button class="dropdown-item" type="button" @click="themeStore.setTheme('dark')" :class="{ active: themeStore.currentTheme === 'dark' }">Темная</button>
          </li>
          <li>
            <button class="dropdown-item" type="button" @click="themeStore.setTheme('auto')" :class="{ active: themeStore.currentTheme === 'auto' }">Автоматически</button>
          </li>
          
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item" @click="handleAuthAction">
              {{ authStore.isAuthenticated ? 'Выйти' : 'Войти' }}
            </button>
          </li>
        </ul>
      </div>
      
    </div>
  </header>
</template>