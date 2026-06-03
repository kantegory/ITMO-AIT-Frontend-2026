<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formEl = ref(null)
const validated = ref(false)
const errorMsg = ref('')
const form = ref({ username: '', email: '', password: '' })

async function submit() {
  if (!formEl.value.checkValidity()) {
    validated.value = true
    return
  }
  errorMsg.value = ''
  try {
    await authStore.register(form.value.username, form.value.email, form.value.password)
    router.push('/profile')
  } catch {
    errorMsg.value = 'Ошибка регистрации. Проверьте, что json-server запущен.'
  }
}
</script>

<template>
  <base-layout>
    <div class="d-flex flex-column align-items-center mt-4">
      <div class="text-center mb-3">
        <div class="brand-title fs-2 fw-bold">AI Hub</div>
        <p class="text-muted small mt-1 mb-0">Платформа для AI моделей и датасетов</p>
      </div>
      <div class="card auth-card shadow p-4" style="min-width: 360px; max-width: 440px; width: 100%">
        <h3 class="fw-bold mb-4 text-center">Регистрация</h3>
        <form
          ref="formEl"
          @submit.prevent="submit"
          novalidate
          :class="{ 'was-validated': validated }"
        >
          <div class="mb-3">
            <label for="regUsername" class="form-label">Имя пользователя</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              id="regUsername"
              required
              minlength="3"
            >
            <div class="invalid-feedback">Минимум 3 символа</div>
          </div>
          <div class="mb-3">
            <label for="regEmail" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="regEmail"
              required
            >
            <div class="invalid-feedback">Введите корректный email</div>
          </div>
          <div class="mb-4">
            <label for="regPassword" class="form-label">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="regPassword"
              required
              minlength="6"
            >
            <div class="invalid-feedback">Минимум 6 символов</div>
          </div>
          <div v-if="errorMsg" class="alert alert-danger py-2 small mb-3" role="alert">
            {{ errorMsg }}
          </div>
          <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
        </form>
        <p class="text-center text-muted small mt-3 mb-0">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </p>
      </div>
    </div>
  </base-layout>

</template>
