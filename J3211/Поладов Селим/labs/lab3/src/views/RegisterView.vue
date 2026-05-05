<template>
  <ThemeToggle fixed />
  <main class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="brand text-decoration-none d-inline-block" aria-label="67 Финансы — на главную">67 Финансы</router-link>
      <h1 class="h2 mt-3">Создать аккаунт</h1>
      <p class="subtitle">Введите свои данные для регистрации</p>
      <form novalidate @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label" for="reg-firstName">Имя</label>
          <input id="reg-firstName" v-model="form.firstName" type="text" class="form-control" placeholder="Иван" autocomplete="given-name" required aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="reg-lastName">Фамилия</label>
          <input id="reg-lastName" v-model="form.lastName" type="text" class="form-control" placeholder="Иванов" autocomplete="family-name" required aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="reg-email">Email</label>
          <input id="reg-email" v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com" autocomplete="email" required aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="reg-password">Пароль</label>
          <input id="reg-password" v-model="form.password" type="password" class="form-control" placeholder="••••••••" autocomplete="new-password" required aria-required="true" />
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3" role="alert" aria-live="assertive">Ошибка регистрации. Возможно, этот email уже занят.</div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Создать аккаунт</button>
      </form>
      <p class="mt-4 text-center text-muted small">
        Уже есть аккаунт? <router-link to="/login" class="auth-link">Войти</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { register } = useAuth()
const form = reactive({ firstName: '', lastName: '', email: '', password: '' })
const error = ref(false)

async function onSubmit() {
  error.value = false
  try {
    await register({ ...form })
    router.push('/dashboard')
  } catch {
    error.value = true
  }
}
</script>
