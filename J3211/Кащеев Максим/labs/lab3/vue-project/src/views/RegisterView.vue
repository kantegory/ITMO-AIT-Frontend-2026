<template>
  <div class="auth-shell">
    <div class="auth-card">
      <RouterLink to="/" class="btn btn-sm btn-outline-glass mb-4">
        <i class="bi bi-arrow-left me-1"></i>На главную
      </RouterLink>
      <h1 class="auth-title">Регистрация</h1>
      <p class="auth-subtitle">Зарегистрируйтесь, чтобы публиковать модели и датасеты</p>

      <div v-if="authError" class="error-box mb-3">{{ authError }}</div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label fw-500">Имя</label>
          <input v-model="name" type="text" class="form-control-glass" placeholder="Иван Иванов" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-500">Email</label>
          <input v-model="email" type="email" class="form-control-glass" placeholder="you@example.com" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-500">Пароль</label>
          <input v-model="password" type="password" class="form-control-glass" placeholder="••••••••" required minlength="6" />
        </div>
        <div class="mb-4">
          <label class="form-label fw-500">Повторите пароль</label>
          <input v-model="passwordConfirm" type="password" class="form-control-glass" placeholder="••••••••" required />
          <div v-if="passwordConfirm && password !== passwordConfirm" class="mt-1" style="font-size:0.82rem;color:#ef4444">
            Пароли не совпадают
          </div>
        </div>

        <div class="form-check mb-3">
          <input v-model="agreed" class="form-check-input" type="checkbox" id="agreeCheck" />
          <label class="form-check-label" for="agreeCheck" style="font-size:0.9rem">
            Я согласен с условиями соглашения
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary-glass w-100 py-2"
          :disabled="loading || !agreed || password !== passwordConfirm"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Зарегистрироваться
        </button>
      </form>

      <p class="text-center mt-3" style="font-size:0.9rem;color:#6b7280">
        Уже есть аккаунт?
        <RouterLink to="/login" style="color:#6366f1">Войти</RouterLink>
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
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const agreed = ref(false)
const loading = ref(false)
const authError = ref('')

async function handleRegister() {
  if (password.value !== passwordConfirm.value) return
  loading.value = true
  authError.value = ''
  try {
    await auth.register(name.value, email.value, password.value)
    router.push({ name: 'Account' })
  } catch (e) {
    authError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
