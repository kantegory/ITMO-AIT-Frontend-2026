<template>
  <header role="banner">
    <nav class="navbar navbar-expand-lg navbar-dark mb-4">
      <div class="container">
        <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <svg class="icon"><use href="/img/sprite.svg#icon-wallet"></use></svg>
          Мои Финансы
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><router-link class="nav-link" to="/">Главная</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/transactions">Транзакции</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/reports">Отчеты</router-link></li>
          </ul>
          <div class="d-flex align-items-center gap-3">
            <span class="text-white fw-bold">{{ userName }}</span>
            <button @click="logout" class="btn btn-outline-light btn-sm d-flex align-items-center gap-1">
              <svg class="icon"><use href="/img/sprite.svg#icon-logout"></use></svg> Выйти
            </button>
            <button @click="toggleTheme" class="btn btn-outline-light btn-sm ms-2" v-html="themeIcon"></button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('Пользователь')
const isDark = ref(false)
const themeIcon = ref('')

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('app_session'))
  if (user) userName.value = user.name

  // Инициализация темы
  const savedTheme = localStorage.getItem('app_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  applyTheme(savedTheme)
})

const toggleTheme = () => {
  applyTheme(isDark.value ? 'light' : 'dark')
}

const applyTheme = (theme) => {
  isDark.value = theme === 'dark'
  document.documentElement.setAttribute('data-bs-theme', theme)
  localStorage.setItem('app_theme', theme)
  themeIcon.value = `<svg class="icon"><use href="/img/sprite.svg#icon-${isDark.value ? 'sun' : 'moon'}"></use></svg>`
}

const logout = () => {
  localStorage.removeItem('app_session')
  router.push('/login')
}
</script>