<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height:calc(100vh - 56px); background:var(--bg-secondary);">
    <div class="card p-4" style="width:420px;">
      <h1 class="h4 mb-4 text-center">Регистрация</h1>
      <div class="row g-2 mb-3">
        <div class="col">
          <label for="name" class="form-label">Имя</label>
          <input id="name" v-model="name" type="text" class="form-control" placeholder="Иван" autocomplete="given-name">
        </div>
        <div class="col">
          <label for="username" class="form-label">Username</label>
          <input id="username" v-model="username" type="text" class="form-control" placeholder="ivan123" autocomplete="username">
        </div>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" placeholder="you@example.com" autocomplete="email">
      </div>
      <div class="mb-3">
        <label for="pass" class="form-label">Пароль</label>
        <input id="pass" v-model="password" type="password" class="form-control" placeholder="Минимум 8 символов" autocomplete="new-password">
      </div>
      <div class="mb-3">
        <label for="pass2" class="form-label">Подтвердите пароль</label>
        <input id="pass2" v-model="password2" type="password" class="form-control" placeholder="Повторите пароль" autocomplete="new-password">
      </div>
      <div class="mb-3 form-check">
        <input id="agree" v-model="agree" type="checkbox" class="form-check-input">
        <label for="agree" class="form-check-label">Согласен с условиями использования</label>
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <button class="btn btn-primary w-100" :disabled="loading" @click="handleRegister">
        {{ loading ? 'Создание...' : 'Создать аккаунт' }}
      </button>
      <p class="text-center mt-3 mb-0" style="font-size:14px;">
        Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { register } = useAuth()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const agree = ref(false)
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!name.value || !username.value || !email.value || !password.value) { error.value = 'Заполните все поля'; return }
  if (password.value !== password2.value) { error.value = 'Пароли не совпадают'; return }
  if (!agree.value) { error.value = 'Примите условия использования'; return }
  loading.value = true
  error.value = ''
  try {
    await register(name.value, username.value, email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>
