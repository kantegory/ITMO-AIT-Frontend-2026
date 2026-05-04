<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <section class="auth-card">
      <header class="auth-card__header">
        <h1 class="auth-card__title">MLPipelines</h1>
        <p class="auth-card__subtitle">Вход в систему</p>
      </header>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="name@yandex.ru" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Пароль</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="********" required>
        </div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <footer class="mt-4 text-center">
        <span class="text-muted">Нет аккаунта?</span>
        <router-link to="/register" class="text-decoration-none"> Зарегистрироваться</router-link>
      </footer>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

const router = useRouter()
const { login } = useAuth()
const { getUsers } = useApi()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await getUsers({ email: email.value })
    const user = res.data.find(u => u.password === password.value)
    if (!user) {
      error.value = 'Неверный email или пароль'
      return
    }
    login(user)
    router.push('/')
  } catch {
    error.value = 'Не удалось связаться с сервером'
  } finally {
    loading.value = false
  }
}
</script>
