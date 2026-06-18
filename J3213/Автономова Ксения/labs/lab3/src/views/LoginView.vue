<template>
  <PageShell main-class="container flex-grow-1">
    <form class="ticket-platform__form" aria-labelledby="loginTitle" @submit.prevent="submitLogin">
      <h2 id="loginTitle" class="ticket-platform__form-title">Вход</h2>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <div class="mb-3">
        <label for="email" class="form-label">Адрес электронной почты</label>
        <input id="email" v-model.trim="form.email" type="email" class="form-control" autocomplete="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input id="password" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required>
      </div>
      <div class="mb-3">
        <label for="userType" class="form-label">Я -</label>
        <select id="userType" v-model="form.role" class="form-select" required>
          <option value="user">Пользователь</option>
          <option value="organizer">Организатор</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">{{ loading ? 'Вход...' : 'Войти' }}</button>
      <div class="text-center mt-3">
        Нет аккаунта? <RouterLink to="/register">Зарегистрируйтесь</RouterLink>
      </div>
    </form>
  </PageShell>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageShell from '../components/PageShell.vue'
import { useAuth } from '../composables/useAuth'
const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const loading = ref(false)
const error = ref('')
const form = reactive({
  email: '',
  password: '',
  role: 'user'
})
async function submitLogin() {
  loading.value = true
  error.value = ''
  try {
    const user = await login(form.email, form.password, form.role)
    const redirect = route.query.redirect || (user.role === 'organizer' ? '/organizer' : '/dashboard')
    router.push(String(redirect))
  } catch (err) {
    error.value = err.response?.data || err.message || 'Не удалось войти'
  } finally {
    loading.value = false
  }
}
</script>
