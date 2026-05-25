<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-lg border-0">
        <div class="card-body p-5">
          <h2 class="text-center mb-4">Вход</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="password" type="password" class="form-control" required>
            </div>
            <div v-if="err" class="alert alert-danger">{{ err }}</div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>
          </form>
          <p class="text-center mt-3">
            Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const email = ref('ivan2@mail.ru')
const password = ref('123456')
const err = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  err.value = ''
  try {
    await login({ email: email.value, password: password.value })
    router.push('/profile')
  } catch (e) {
    err.value = e.response?.data?.message || e.message || 'Ошибка входа'
    console.error('Login error:', e)
  } finally {
    loading.value = false
  }
}
</script>