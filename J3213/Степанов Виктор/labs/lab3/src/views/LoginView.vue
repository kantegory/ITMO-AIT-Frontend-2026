<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height:calc(100vh - 56px); background:var(--bg-secondary);">
    <div class="card p-4" style="width:380px;">
      <h1 class="h4 mb-4 text-center">Вход</h1>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" placeholder="you@example.com" autocomplete="email">
      </div>
      <div class="mb-3">
        <label for="pass" class="form-label">Пароль</label>
        <input id="pass" v-model="password" type="password" class="form-control" placeholder="Пароль" autocomplete="current-password">
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <button class="btn btn-primary w-100 mb-3" :disabled="loading" @click="handleLogin">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
      <p class="text-center mb-0" style="font-size:14px;">
        Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) { error.value = 'Заполните все поля'; return }
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
