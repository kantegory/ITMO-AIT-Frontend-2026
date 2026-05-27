<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const theme = ref(localStorage.getItem('theme') || 'light')

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-bs-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body border-bottom" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand brand-name" to="/dashboard">a<span>Nikral</span></RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Открыть меню">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/dashboard" active-class="active">
              <svg width="16" height="16" class="me-1"><use href="/sprite.svg#icon-home"/></svg>Кабинет
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/transactions" active-class="active">
              <svg width="16" height="16" class="me-1"><use href="/sprite.svg#icon-list"/></svg>Транзакции
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/reports" active-class="active">
              <svg width="16" height="16" class="me-1"><use href="/sprite.svg#icon-chart"/></svg>Отчёты
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/accounts" active-class="active">
              <svg width="16" height="16" class="me-1"><use href="/sprite.svg#icon-card"/></svg>Счета
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">
              <svg width="16" height="16" class="me-1"><use href="/sprite.svg#icon-logout"/></svg>Выйти
            </a>
          </li>
        </ul>
        <button class="btn btn-sm btn-outline-secondary ms-3" @click="toggleTheme">
          {{ theme === 'dark' ? 'Светлая' : 'Тёмная' }}
        </button>
      </div>
    </div>
  </nav>
</template>
