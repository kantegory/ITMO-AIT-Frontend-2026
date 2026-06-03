<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const { theme, toggleTheme } = useTheme()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const userAvatar = computed(() => {
  if (!authStore.user) return ''
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=a855f7&color=fff`
})
const shortName = computed(() => authStore.user ? authStore.user.name.split(' ')[0] : '')

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg custom-navbar py-3" aria-label="Главная навигация">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold fs-3 text-white" to="/">
        Posi<span class="neon-text">Max</span>
      </RouterLink>
      
      <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" :class="route.path === '/' ? 'text-white fw-bold' : 'text-white-50'" to="/">Каталог</RouterLink>
          </li>
          <li class="nav-item" v-if="authStore.user">
            <RouterLink class="nav-link" :class="route.path === '/profile' ? 'text-white fw-bold' : 'text-white-50'" to="/profile">Мой прогресс</RouterLink>
          </li>
        </ul>
        
        <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          <button @click="toggleTheme" class="btn btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
            <svg width="20" height="20">
              <use :href="theme === 'dark' ? '/img/sprite.svg#sun' : '/img/sprite.svg#moon'"></use>
            </svg>
          </button>
          
          <div v-if="!authStore.user" class="d-flex flex-column flex-lg-row gap-2">
            <RouterLink to="/login" class="btn btn-outline-light rounded-pill px-4 fw-bold">Войти</RouterLink>
            <RouterLink to="/register" class="btn btn-neon rounded-pill px-4 fw-bold">Регистрация</RouterLink>
          </div>

          <div v-else class="dropdown">
            <a class="text-decoration-none d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
              <img :src="userAvatar" class="rounded-circle border border-secondary" width="40" height="40" alt="Аватар">
              <span class="text-white ms-2 d-none d-md-inline fw-bold theme-text">{{ shortName }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2 border-secondary shadow-lg">
              <li><RouterLink class="dropdown-item" to="/profile">Личный кабинет</RouterLink></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><a class="dropdown-item text-danger fw-bold" href="#" @click.prevent="handleLogout">Выйти</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>