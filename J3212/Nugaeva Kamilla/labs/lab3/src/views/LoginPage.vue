<template>
  <div class="auth-layout">
    <div class="auth-card">
      <span class="page-kicker">Авторизация</span>

      <h1 class="page-title">Вход</h1>

      <p class="page-subtitle mb-4">
        Войдите, чтобы сохранять маршруты, заметки и подборки направлений.
      </p>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input
            id="loginEmail"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            placeholder="name@example.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="loginPassword" class="form-label">Пароль</label>
          <input
            id="loginPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Введите пароль"
            autocomplete="current-password"
            required
          />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div class="form-check">
            <input
              id="rememberMe"
              v-model="form.remember"
              class="form-check-input"
              type="checkbox"
            />

            <label class="form-check-label" for="rememberMe">
              Запомнить меня
            </label>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Входим...' : 'Войти' }}
        </button>
      </form>

      <hr class="my-4" />

      <p class="mb-0 small">
        Нет аккаунта?
        <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await login(form.email, form.password)
    router.push('/profile')
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось войти в аккаунт.'
  } finally {
    isLoading.value = false
  }
}
</script>