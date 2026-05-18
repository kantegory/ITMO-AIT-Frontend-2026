<template>
  <ThemeToggle fixed />
  <main class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="brand text-decoration-none d-inline-block" aria-label="67 Финансы — на главную">67 Финансы</router-link>
      <h1 class="h2 mt-3">Вход</h1>
      <p class="subtitle">Введите данные для входа в аккаунт</p>
      <form novalidate @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label" for="login-email">Email</label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="example@gmail.com"
            autocomplete="email"
            required
            aria-required="true"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="login-password">Пароль</label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            aria-required="true"
          />
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3" role="alert" aria-live="assertive">Неверный email или пароль</div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Войти</button>
      </form>
      <p class="mt-4 text-center text-muted small">
        Нет аккаунта? <router-link to="/register" class="auth-link">Зарегистрироваться</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref(false)

async function onSubmit() {
  error.value = false
  try {
    await login({ ...form })
    router.push('/dashboard')
  } catch {
    error.value = true
  }
}
</script>
