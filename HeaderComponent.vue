<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { theme, toggleTheme, applyTheme } = useTheme()

const handleLogout = () => {
  logout()
  router.push('/login')
}

onMounted(() => {
  applyTheme()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        SpeakEasy
      </RouterLink>

      <ul class="navbar-nav ms-auto align-items-center">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            Главная
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/about">
            О нас
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/courses">
            Курсы
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/contacts">
            Контакты
          </RouterLink>
        </li>

        <template v-if="currentUser">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/cabinet">
              Кабинет
            </RouterLink>
          </li>

          <li class="nav-item">
            <button class="btn btn-outline-light ms-2" @click="handleLogout">
              Выйти
            </button>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">
              Вход
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="btn btn-primary ms-2" to="/register">
              Регистрация
            </RouterLink>
          </li>
        </template>

        <li class="nav-item ms-3">
          <button class="btn btn-outline-light btn-sm" @click="toggleTheme">
            {{ theme === 'light' ? '🌙' : '☀️' }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>