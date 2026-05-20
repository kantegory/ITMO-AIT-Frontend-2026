<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const { login } = useAuth()

async function handleLogin() {
  try {
    error.value = ''
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="container py-block">
      <div class="auth-wrapper auth-form-box">
        <h1>Вход</h1>
        <input v-model="email" class="custom-input" placeholder="Email" />
        <input v-model="password" class="custom-input" placeholder="Пароль" type="password" />
        <button class="btn btn-main" @click="handleLogin">Войти</button>
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </div>
  </div>
</template>