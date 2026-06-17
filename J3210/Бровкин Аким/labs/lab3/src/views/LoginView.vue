<template>
  <main class="auth-wrapper">
    <div class="theme-toggle-wrapper-auth">
      <button @click="toggleTheme" class="theme-toggle-btn me-3 text-light">
  <svg class="icon">
    <use :href="theme === 'dark' ? '#icon-sun' : '#icon-theme'"></use>
  </svg>
</button>
    </div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="edu-card p-4">
            <h3 class="text-center mb-4">Вход в EduPlatform</h3>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label" for="email">Email</label>
                <input v-model="email" type="email" id="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label" for="password">Пароль</label>
                <input v-model="password" type="password" id="password" class="form-control" required>
              </div>
              <button type="submit" class="btn-brand w-100">
                <svg class="icon me-2"><use href="#icon-user"></use></svg>Войти
              </button>
            </form>
            <div class="text-center mt-3">
              <span class="text-muted">Нет аккаунта?</span> <router-link to="/register">Зарегистрироваться</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'

const { login } = useAuth()
const { theme, toggleTheme } = useTheme()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  login(email.value, password.value)
}
</script>
