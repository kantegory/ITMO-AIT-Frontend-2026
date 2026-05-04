<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''
    await login(email.value, password.value)
    router.push('/cabinet')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4">Вход</h2>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          required
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Пароль</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
        >
      </div>

      <p v-if="error" class="text-danger">{{ error }}</p>

      <button class="btn btn-primary w-100" type="submit">
        Войти
      </button>
    </form>

    <p class="mt-3">
      Нет аккаунта?
      <RouterLink to="/register">Зарегистрироваться</RouterLink>
    </p>
  </div>
</template>