<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'
import { createUser } from '@/services/api'

const router = useRouter()
const { register } = useAuth()
const form = reactive({ name: '', email: '', password: '', agreement: false })
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!form.name || !form.email || !form.password || !form.agreement) {
    error.value = 'Заполните форму и примите условия.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await createUser({ name: form.name, email: form.email, registeredAt: new Date().toISOString() })
    register({ name: form.name, email: form.email })
    router.push({ name: 'dashboard' })
  } catch {
    error.value = 'Регистрация недоступна: запустите локальный API командой npm run api.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-card card shadow-sm p-4">
    <RouterLink class="brand d-flex justify-content-center align-items-center mb-4 text-decoration-none" :to="{ name: 'home' }">
      <svg class="bi me-2 text-primary" width="36" height="36"><use href="#airplane" /></svg>
      <span class="fs-3 fw-bold text-primary">TravelPlan</span>
    </RouterLink>
    <h1 class="h3 text-center mb-4">Регистрация</h1>
    <div v-if="error" class="alert alert-warning">{{ error }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3"><label class="form-label" for="name">Имя</label><input id="name" v-model.trim="form.name" type="text" class="form-control" required></div>
      <div class="mb-3"><label class="form-label" for="reg-email">Email</label><input id="reg-email" v-model.trim="form.email" type="email" class="form-control" required></div>
      <div class="mb-3"><label class="form-label" for="reg-password">Пароль</label><input id="reg-password" v-model="form.password" type="password" class="form-control" minlength="6" required></div>
      <div class="form-check mb-4"><input id="agreement" v-model="form.agreement" type="checkbox" class="form-check-input" required><label for="agreement" class="form-check-label">Согласен с условиями сервиса</label></div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">{{ loading ? 'Создаём профиль...' : 'Зарегистрироваться' }}</button>
    </form>
    <p class="text-center mt-3 mb-0">Уже есть аккаунт? <RouterLink :to="{ name: 'login' }">Войти</RouterLink></p>
    <ThemeToggle class="w-100" />
  </section>
</template>
