<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const route = useRoute()
const userName = ref('')
const { currentTheme, toggleTheme } = useTheme()

onMounted(() => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    router.push('/login')
  } else {
    userName.value = localStorage.getItem('userName') || 'Гость'
  }
})

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userName')
  router.push('/login')
}

const logoSrc = computed(() => {
  return currentTheme.value === 'zombie' ? '/img/zombie_logo.png' : '/img/logo.png'
})
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm" aria-label="Главная навигация">
      <div class="container-fluid">
        <RouterLink class="navbar-brand fw-bold d-flex align-items-center" to="/dashboard" aria-label="Финанас - На главную">
          <img :src="logoSrc" alt="Логотип Финанас" width="45" class="me-2">
          Финанас
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Открыть меню">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.path === '/dashboard' }" to="/dashboard">
                <i class="bi bi-house-door me-1"></i> Главная
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.path === '/search' }" to="/search">
                <i class="bi bi-search me-1"></i> Операции
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.path === '/reports' }" to="/reports">
                <i class="bi bi-pie-chart me-1"></i> Отчеты
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.path === '/integrations' }" to="/integrations">
                <i class="bi bi-plug me-1"></i> Настройки
              </RouterLink>
            </li>
          </ul>

          <div class="d-flex align-items-center mt-2 mt-lg-0">
            <button @click="toggleTheme" class="btn btn-outline-light btn-sm me-3 d-flex align-items-center" aria-label="Переключить тему">
              <template v-if="currentTheme === 'zombie'">
                <img src="/img/logo.png" width="26" height="26" style="object-fit: contain;" class="me-2" alt="Ананас"> Вернуть норму
              </template>
              <template v-else>
                <img src="/img/zombie_logo.png" width="26" height="26" style="object-fit: contain;" class="me-2" alt="Зомби"> Зомби-мод
              </template>
            </button>
            <span class="navbar-text text-white me-3 d-none d-lg-block" aria-live="polite">Привет, {{ userName }}!</span>

            <button @click="handleLogout" class="btn btn-outline-light btn-sm" aria-label="Выйти из аккаунта">
              <i class="bi bi-box-arrow-right me-1"></i> Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
