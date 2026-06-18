<template>
  <PageShell main-class="container flex-grow-1">
    <form class="ticket-platform__form" aria-labelledby="registerTitle" @submit.prevent="submitRegister">
      <h2 id="registerTitle" class="ticket-platform__form-title">Создать аккаунт</h2>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <div class="mb-3">
        <label for="name" class="form-label">ФИО</label>
        <input id="name" v-model.trim="form.name" type="text" class="form-control" autocomplete="name" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Адрес электронной почты</label>
        <input id="email" v-model.trim="form.email" type="email" class="form-control" autocomplete="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input id="password" v-model="form.password" type="password" class="form-control" autocomplete="new-password" required>
      </div>
      <div class="mb-3">
        <label for="confirm" class="form-label">Повторите пароль</label>
        <input id="confirm" v-model="form.confirm" type="password" class="form-control" autocomplete="new-password" required>
      </div>
      <div class="mb-3">
        <label for="userType" class="form-label">Я -</label>
        <select id="userType" v-model="form.role" class="form-select" required>
          <option value="user">Пользователь</option>
          <option value="organizer">Организатор</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">{{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}</button>
      <div class="text-center mt-3">
        Уже зарегистрированы? <RouterLink to="/login">Войти</RouterLink>
      </div>
    </form>
  </PageShell>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageShell from '../components/PageShell.vue'
import { useAuth } from '../composables/useAuth'
const router = useRouter()
const { register } = useAuth()
const loading = ref(false)
const error = ref('')
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
  role: 'user'
})
async function submitRegister() {
  error.value = ''
  if (form.password !== form.confirm) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  const parts = form.name.trim().split(/\s+/)
  const firstName = parts.shift() || ''
  const lastName = parts.join(' ')
  try {
    const user = await register({
      email: form.email,
      password: form.password,
      firstName,
      lastName,
      role: form.role
    })
    router.push(user.role === 'organizer' ? '/organizer' : '/dashboard')
  } catch (err) {
    error.value = err.response?.data || err.message || 'Не удалось зарегистрироваться'
  } finally {
    loading.value = false
  }
}
</script>
