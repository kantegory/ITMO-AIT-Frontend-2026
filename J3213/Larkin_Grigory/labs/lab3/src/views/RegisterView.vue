<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
    <div class="card shadow-sm p-4" style="width:100%;max-width:400px">
      <h1 class="h4 text-center mb-1 brand-name">a<span>Nikral</span></h1>
      <p class="text-center text-muted small mb-4">Создать аккаунт</p>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form @submit.prevent="submit" novalidate>
        <div class="mb-3">
          <label class="form-label" for="name">Имя</label>
          <input v-model="name" type="text" class="form-control" id="name" placeholder="Иван Иванов" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="example@mail.ru" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Пароль</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="••••••••" required>
        </div>
        <div class="mb-4">
          <label class="form-label" for="confirm">Подтверждение пароля</label>
          <input v-model="confirm" type="password" class="form-control" id="confirm" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Регистрируем...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="text-center small text-muted mt-3 mb-0">
        Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
      </p>
    </div>
  </div>
</template>
