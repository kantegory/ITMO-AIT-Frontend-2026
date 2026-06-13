<template>
  <main class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h1 class="h4 mb-3 text-center">
          <span class="logo-n3n">
            <span class="logo-n3n-black">n</span><span class="logo-n3n-red">3</span><span class="logo-n3n-black">n</span>
          </span>
        </h1>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="mb-3">
            <label class="form-label" for="login-email">Email</label>
            <input id="login-email" type="email" class="form-control" v-model="email" autocomplete="email" required />
          </div>
          <div class="mb-3">
            <label class="form-label" for="login-password">Пароль</label>
            <input id="login-password" type="password" class="form-control" v-model="password" autocomplete="current-password" required />
          </div>
          <div v-if="error" class="mb-3">
            <small class="text-danger">{{ error }}</small>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>

        <div class="text-center mt-3">
          <router-link to="/register" class="small">Нет аккаунта? Зарегистрироваться</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value.trim())
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>