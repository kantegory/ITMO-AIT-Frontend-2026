<template>
  <div class="auth-shell">
    <div class="auth-card">
      <RouterLink to="/" class="btn btn-sm btn-outline-glass mb-4">
        <i class="bi bi-arrow-left me-1"></i>На главную
      </RouterLink>
      <h1 class="auth-title">Вход</h1>
      <p class="auth-subtitle">Войдите, чтобы публиковать модели и датасеты</p>

      <div v-if="authError" class="error-box mb-3">{{ authError }}</div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-500">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control-glass"
            placeholder="you@example.com"
            required
          />
        </div>
        <div class="mb-4">
          <label class="form-label fw-500">Пароль</label>
          <input
            v-model="password"
            type="password"
            class="form-control-glass"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary-glass w-100 py-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Войти
        </button>
      </form>

      <p class="text-center mt-3" style="font-size:0.9rem;color:#6b7280">
        Нет аккаунта?
        <RouterLink to="/register" style="color:#6366f1">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const authError = ref('')

async function handleLogin() {
  loading.value = true
  authError.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'Account' })
  } catch (e) {
    authError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
