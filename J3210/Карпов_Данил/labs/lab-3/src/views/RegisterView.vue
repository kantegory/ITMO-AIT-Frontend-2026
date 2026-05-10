<template>
  <div class="container py-5" style="max-width: 480px">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h2 class="fw-bold mb-1 text-center">Регистрация</h2>
        <p class="text-muted text-center mb-4 small">Создайте бесплатный аккаунт</p>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label class="form-label">Имя</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Иван Иванов" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль <span class="text-muted small">(минимум 6 символов)</span></label>
            <input v-model="form.password" type="password" class="form-control" placeholder="••••••" minlength="6" required />
          </div>
          <div class="mb-4">
            <label class="form-label">Роль</label>
            <div class="d-flex gap-3">
              <div class="form-check">
                <input id="roleStudent" v-model="form.role" class="form-check-input" type="radio" value="student" />
                <label class="form-check-label" for="roleStudent">Студент</label>
              </div>
              <div class="form-check">
                <input id="roleTeacher" v-model="form.role" class="form-check-input" type="radio" value="teacher" />
                <label class="form-check-label" for="roleTeacher">Преподаватель</label>
              </div>
            </div>
          </div>
          <button class="btn btn-warning w-100 fw-bold" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Создать аккаунт
          </button>
        </form>

        <p class="text-center mt-3 mb-0 small">
          Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ name: '', email: '', password: '', role: 'student' as 'student' | 'teacher' })
const loading = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  loading.value = true
  error.value = null
  try {
    await auth.register(form.value)
    router.push('/')
  } catch (e: unknown) {
    error.value =
      (e as { response?: { data?: { error?: string } } })?.response?.data?.error ||
      'Ошибка регистрации. Попробуйте снова.'
  } finally {
    loading.value = false
  }
}
</script>
