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
const form = ref({ email: '', password: '' })

async function submit() {
  if (!formEl.value.checkValidity()) {
    validated.value = true
    return
  }
  errorMsg.value = ''
  try {
    const ok = await authStore.login(form.value.email, form.value.password)
    if (ok) {
      router.push('/profile')
    } else {
      errorMsg.value = 'Неверный email или пароль'
    }
  } catch {
    errorMsg.value = 'Ошибка сервера. Проверьте, что json-server запущен.'
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
        <h3 class="fw-bold mb-4 text-center">Вход</h3>
        <form
          ref="formEl"
          @submit.prevent="submit"
          novalidate
          :class="{ 'was-validated': validated }"
        >
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="loginEmail"
              required
            >
            <div class="invalid-feedback">Введите корректный email</div>
          </div>
          <div class="mb-4">
            <label for="loginPassword" class="form-label">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="loginPassword"
              required
            >
            <div class="invalid-feedback">Введите пароль</div>
          </div>
          <div v-if="errorMsg" class="alert alert-danger py-2 small mb-3" role="alert">
            {{ errorMsg }}
          </div>
          <button type="submit" class="btn btn-primary w-100">Войти</button>
        </form>
        <p class="text-center text-muted small mt-3 mb-0">
          Нет аккаунта?
          <router-link to="/register">Зарегистрируйтесь</router-link>
        </p>
      </div>
    </div>
  </base-layout>

</template>
