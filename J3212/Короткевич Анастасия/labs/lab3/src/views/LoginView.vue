<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const email = ref('nastya@gmail.com')
const password = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''
  try {
    await login(email.value, password.value)
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>Вход</h1>
    <form @submit.prevent="submit">
      <label>Email</label>
      <input v-model="email" type="email" required />
      <label>Пароль</label>
      <input v-model="password" type="password" />
      <button class="primary-btn" type="submit">Войти</button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </form>
    <RouterLink to="/register">Создать аккаунт</RouterLink>
  </section>
</template>
