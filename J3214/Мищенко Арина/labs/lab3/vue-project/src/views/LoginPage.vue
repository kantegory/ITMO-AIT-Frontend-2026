<template>
  <auth-layout>
    <div class="card shadow-sm border-0 p-4" style="width:100%;max-width:420px;">
      <h2 class="mb-1 fw-bold">Добро пожаловать</h2>
      <p class="text-muted mb-4">Войдите в свой аккаунт</p>

      <!-- Выбор роли — как в login.html -->
      <div class="mb-4">
        <label class="form-label">Войти как</label>
        <div class="d-flex gap-2">
          <button type="button" class="role-btn" :class="{ active: role === 'student' }" @click="role = 'student'">
            <i class="bi bi-person-fill"></i><span>Студент</span>
          </button>
          <button type="button" class="role-btn" :class="{ active: role === 'teacher' }" @click="role = 'teacher'">
            <i class="bi bi-person-workspace"></i><span>Преподаватель</span>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input id="loginEmail" type="email" class="form-control" v-model="email" placeholder="you@example.com" required />
        </div>
        <div class="mb-4">
          <label for="loginPass" class="form-label">Пароль</label>
          <input id="loginPass" type="password" class="form-control" v-model="password" placeholder="••••••••" required />
        </div>

        <div v-if="error" class="alert alert-danger mb-3 py-2" role="alert">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
        <p class="text-center text-muted small">
          Нет аккаунта?
          <router-link to="/register" class="text-primary text-decoration-none">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
  </auth-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth }    from '@/composables/useAuth'
import { useLoading } from '@/composables/useLoading'
import AuthLayout from '@/layouts/AuthLayout.vue'

const { login, error } = useAuth()
const { loading, withLoading } = useLoading()

const email    = ref('')
const password = ref('')
const role     = ref('student')

function handleLogin() {
  withLoading(() => login(email.value, password.value, role.value))
}
</script>

<style scoped>
.role-btn {
  flex: 1; border: 2px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;
  background: #fff; cursor: pointer; transition: all .2s; text-align: center; color: #64748b;
}
.role-btn:hover { border-color: #93c5fd; }
.role-btn.active { border-color: #0d6efd; background: #eff6ff; color: #0d6efd; }
.role-btn i { display: block; font-size: 1.6rem; margin-bottom: 6px; }
.role-btn span { font-size: .85rem; font-weight: 600; }
</style>
