<template>
  <div class="auth-page-bg d-flex align-items-center justify-content-center min-vh-100 position-relative p-3">
    
    <div class="position-absolute top-0 end-0 p-4">
      <a href="#" class="small text-white-50 text-decoration-none fw-medium me-2">Русский</a>
      <a href="#" class="small text-white-50 text-decoration-none fw-medium">English</a>
    </div>

    <main class="card border-0 shadow-lg p-4 p-sm-5 bg-white text-center" style="max-width: 440px; width: 100%; border-radius: 24px !important;">
      <h1 class="h3 fw-bold mb-4 text-dark" style="letter-spacing: -0.5px;">Moneta ID</h1>

      <div v-if="errorMessage" class="alert alert-danger py-2 small" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3 text-start">
          <label for="emailInput" class="visually-hidden">Email</label>
          <input 
            id="emailInput" 
            v-model.trim="email" 
            type="email" 
            class="form-control form-control-lg shadow-none fs-6 py-3" 
            placeholder="Email" 
            required 
          />
        </div>

        <div class="mb-3 text-start">
          <label for="passwordInput" class="visually-hidden">Пароль</label>
          <input 
            id="passwordInput" 
            v-model="password" 
            type="password" 
            class="form-control form-control-lg shadow-none fs-6 py-3" 
            placeholder="Пароль" 
            required 
          />
        </div>

        <div class="d-flex justify-content-between align-items-center small mb-4">
          <div class="form-check m-0">
            <input id="rememberMe" v-model="rememberMe" class="form-check-input shadow-none" type="checkbox" />
            <label class="form-check-label text-secondary fw-medium" for="rememberMe">
              Запомнить меня
            </label>
          </div>
          <a href="#" class="text-decoration-none fw-medium">Забыли пароль?</a>
        </div>

        <button type="submit" class="btn btn-dark w-100 fw-semibold py-3 rounded-3 mb-2 fs-6" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Вход...' : 'Вход' }}
        </button>
        
        <router-link to="/register" class="btn btn-light w-100 fw-semibold py-3 rounded-3 text-dark mb-4 fs-6">
          Регистрация
        </router-link>
      </form>

      <div class="position-relative mb-4">
        <hr class="text-muted opacity-25" />
        <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">или войдите с помощью</span>
      </div>

      <div class="d-flex justify-content-center gap-3">
        <button type="button" class="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 44px; height: 44px;" aria-label="Войти через VK">
          <span class="fw-bold text-primary">VK</span>
        </button>
        <button type="button" class="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 44px; height: 44px;" aria-label="Войти через Яндекс">
          <span class="fw-bold text-danger">Я</span>
        </button>
      </div>
    </main>

    <div class="position-absolute bottom-0 text-center pb-4 w-100">
      <a href="#" class="small text-white-50 text-decoration-none m-0">Поддержка</a>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Ошибка авторизации'
  } finally {
    isLoading.value = false
  }
}
</script>