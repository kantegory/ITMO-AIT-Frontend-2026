<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const { register } = useAuth()

async function handleRegister() {
  try {
    error.value = ''
    await register(name.value, email.value, password.value)
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
        <h1>Регистрация</h1>
        <input v-model="name" class="custom-input" placeholder="Имя" />
        <input v-model="email" class="custom-input" placeholder="Email" />
        <input v-model="password" class="custom-input" placeholder="Пароль" type="password" />
        <button class="btn btn-main" @click="handleRegister">Создать аккаунт</button>
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </div>
  </div>
</template>