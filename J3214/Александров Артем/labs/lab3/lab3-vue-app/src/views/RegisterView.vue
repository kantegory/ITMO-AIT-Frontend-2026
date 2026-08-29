<template>
  <div class="auth-page-bg d-flex align-items-center justify-content-center min-vh-100 position-relative p-3">
    
    <div class="position-absolute top-0 end-0 p-4">
      <a href="#" class="small text-white-50 text-decoration-none fw-medium me-2">Русский</a>
      <a href="#" class="small text-white-50 text-decoration-none fw-medium">English</a>
    </div>

    <main class="card border-0 shadow-lg p-4 p-sm-5 bg-white text-center" style="max-width: 460px; width: 100%; border-radius: 24px !important;">
      <h1 class="h3 fw-bold mb-2 text-dark" style="letter-spacing: -0.5px;">Регистрация</h1>
      <p class="text-muted small mb-4">Создайте новый аккаунт Moneta ID</p>

      <div v-if="errorMessage" class="alert alert-danger py-2 small" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3 text-start">
          <label for="nameInput" class="visually-hidden">Имя</label>
          <input 
            id="nameInput" 
            v-model.trim="name" 
            type="text" 
            class="form-control form-control-lg shadow-none fs-6 py-3" 
            placeholder="Имя" 
            required 
          />
        </div>

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

        <div class="mb-4 text-start">
          <label for="confirmPasswordInput" class="visually-hidden">Повтор пароля</label>
          <input 
            id="confirmPasswordInput" 
            v-model="confirmPassword" 
            type="password" 
            class="form-control form-control-lg shadow-none fs-6 py-3" 
            placeholder="Повтор пароля" 
            required 
          />
        </div>

        <button type="submit" class="btn btn-dark w-100 fw-semibold py-3 rounded-3 mb-4 fs-6" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="position-relative mb-4">
        <hr class="text-muted opacity-25" />
        <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">уже есть аккаунт?</span>
      </div>

      <router-link to="/login" class="btn btn-light w-100 fw-semibold py-3 rounded-3 text-dark fs-6">
        Войти в аккаунт
      </router-link>
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
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>