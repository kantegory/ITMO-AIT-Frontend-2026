<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePageTitle } from '@/composables/usePageTitle'

usePageTitle('Вход')

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  errorMessage.value = ''
  
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<template>
  <main class="d-flex justify-content-center align-items-center vh-100" id="loginMain">
    <div class="card border-3 rounded-4 auth-card auth-card-login" id="loginCard">
      <div class="card-body p-4 p-sm-5">
        <div class="text-center mb-4">
          <h1 class="display-5 fw-bold app-logo mb-1">MLShare</h1>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-2">
            <label for="emailInput" class="form-label">Email адрес</label>
            <input type="email" class="form-control" id="emailInput" v-model="email" placeholder="name@example.com" required>
          </div>

          <div class="mb-2">
            <label for="passwordInput" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="passwordInput" v-model="password" placeholder="Введите пароль" required>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" value="1">
              <label class="form-check-label small text-blunted" for="rememberMe">Запомнить меня</label>
            </div>
            <button type="button" class="btn btn-link text-decoration-none small p-0" id="forgotPasswordLink">Забыли пароль?</button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn bg-primary text-white w-100 py-2 mb-3" id="loginSubmitButton">Войти</button>

          <div class="text-center small text-blunted">
            Нет аккаунта? <router-link to="/register" class="text-decoration-none fw-bold" id="goToRegisterLink">Зарегистрироваться</router-link>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>