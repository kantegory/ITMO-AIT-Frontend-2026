<template>
  <auth-layout>
    <div class="card shadow-sm border-0 p-4" style="width:100%;max-width:480px;">
      <h2 class="mb-1 fw-bold">Создать аккаунт</h2>
      <p class="text-muted mb-4">Заполните данные для регистрации</p>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="form-label">Я регистрируюсь как</label>
          <div class="d-flex gap-2">
            <button type="button" class="role-btn" :class="{ active: role === 'student' }" @click="role = 'student'">
              <i class="bi bi-person-fill"></i><span>Студент</span>
            </button>
            <button type="button" class="role-btn" :class="{ active: role === 'teacher' }" @click="role = 'teacher'">
              <i class="bi bi-person-workspace"></i><span>Преподаватель</span>
            </button>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-6">
            <label for="regFirst" class="form-label">Имя</label>
            <input id="regFirst" type="text" class="form-control" v-model="firstName" placeholder="Иван" required />
          </div>
          <div class="col-6">
            <label for="regLast" class="form-label">Фамилия</label>
            <input id="regLast" type="text" class="form-control" v-model="lastName" placeholder="Иванов" required />
          </div>
        </div>
        <div class="mb-3">
          <label for="regEmail" class="form-label">Email</label>
          <input id="regEmail" type="email" class="form-control" v-model="email" placeholder="you@example.com" required />
        </div>
        <div class="mb-3">
          <label for="regPass" class="form-label">Пароль</label>
          <input id="regPass" type="password" class="form-control" v-model="password" placeholder="Минимум 8 символов" required />
        </div>
        <div class="mb-4">
          <label for="regPass2" class="form-label">Повторите пароль</label>
          <input id="regPass2" type="password" class="form-control" v-model="passwordConfirm" placeholder="••••••••" required />
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="terms" v-model="termsAccepted" />
          <label class="form-check-label text-muted small" for="terms">
            Я принимаю <a href="#" class="text-primary text-decoration-none">условия использования</a>
          </label>
        </div>

        <div v-if="localError" class="alert alert-danger py-2 mb-3">{{ localError }}</div>
        <div v-if="storeError" class="alert alert-danger py-2 mb-3">{{ storeError }}</div>
        <div v-if="success"    class="alert alert-success py-2 mb-3">Аккаунт создан! Перенаправляем...</div>

        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Зарегистрироваться
        </button>
        <p class="text-center text-muted small">
          Уже есть аккаунт?
          <router-link to="/login" class="text-primary text-decoration-none">Войти</router-link>
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

const { register, error: storeError } = useAuth()
const { loading, withLoading } = useLoading()

const firstName       = ref('')
const lastName        = ref('')
const email           = ref('')
const password        = ref('')
const passwordConfirm = ref('')
const role            = ref('student')
const termsAccepted   = ref(false)
const localError      = ref('')
const success         = ref(false)

function handleRegister() {
  localError.value = ''
  if (!termsAccepted.value) { localError.value = 'Необходимо принять условия использования'; return }
  if (password.value !== passwordConfirm.value) { localError.value = 'Пароли не совпадают'; return }
  success.value = false
  withLoading(async () => {
    const ok = await register(firstName.value, lastName.value, email.value, password.value, role.value)
    if (ok) success.value = true
  })
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
