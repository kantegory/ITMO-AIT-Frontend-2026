<template>
  <div class="container py-5" style="max-width: 440px">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h2 class="fw-bold mb-1 text-center">Вход</h2>
        <p class="text-muted text-center mb-4 small">Войдите в свой аккаунт</p>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="you@example.com"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="••••••"
              required
            />
          </div>
          <button class="btn btn-warning w-100 fw-bold" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Войти
          </button>
        </form>

        <hr class="my-3" />
        <p class="text-muted small mb-2">Быстрый вход для тестирования:</p>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm flex-fill" @click="fillStudent">
            Студент
          </button>
          <button class="btn btn-outline-secondary btn-sm flex-fill" @click="fillTeacher">
            Преподаватель
          </button>
        </div>

        <p class="text-center mt-3 mb-0 small">
          Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    await auth.login(form.value)
    router.push('/')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}

function fillStudent() {
  form.value = { email: 'admin@minion.ru', password: 'admin123' }
}

function fillTeacher() {
  form.value = { email: 'teacher@minion.ru', password: 'teacher123' }
}
</script>
