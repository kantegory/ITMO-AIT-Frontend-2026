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
          <div class="auth-card p-4 shadow">
            <h2 class="text-center mb-4">Регистрация</h2>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="fullName" class="form-label">Имя и Фамилия</label>
                <input v-model="fullName" type="text" id="fullName" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" type="email" id="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input v-model="password" type="password" id="password" class="form-control" required>
              </div>
              <button type="submit" class="btn-brand w-100">
                <svg class="icon me-2"><use href="#icon-user"></use></svg>Создать аккаунт
              </button>
            </form>
            <p class="text-center mt-3">
              Уже есть аккаунт? <router-link to="/">Войти</router-link>
            </p>
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

const { register } = useAuth()
const { theme, toggleTheme } = useTheme()

const fullName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  register(fullName.value, email.value, password.value)
}
</script>
