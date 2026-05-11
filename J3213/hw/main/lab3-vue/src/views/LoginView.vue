<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
  email: 'admin',
  password: 'admin',
})
const status = ref('')
const error = ref('')

const submit = async () => {
  status.value = ''
  error.value = ''

  try {
    await login(form)
    status.value = 'Вход выполнен успешно. Сейчас откроется личный кабинет.'
    setTimeout(() => router.push('/dashboard'), 400)
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="container">
    <div class="auth-card">
      <div class="badge-soft mb-3">
        <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-user"></use></svg>
        Вход
      </div>
      <h1 class="section-title mb-3">Авторизация пользователя</h1>
      <p class="muted mb-4">Тестовый пользователь: <strong>admin</strong> / <strong>admin</strong>.</p>

      <form @submit.prevent="submit" novalidate>
        <div class="mb-3">
          <label class="form-label" for="login-email">Электронная почта</label>
          <input id="login-email" v-model="form.email" class="form-control" type="email" required>
        </div>

        <div class="mb-4">
          <label class="form-label" for="login-password">Пароль</label>
          <input id="login-password" v-model="form.password" class="form-control" type="password" required minlength="6">
        </div>

        <div class="d-flex flex-wrap gap-3">
          <button class="btn btn-primary" type="submit">Войти</button>
          <RouterLink class="btn btn-outline-primary" to="/register">Создать аккаунт</RouterLink>
        </div>
      </form>

      <p v-if="status" class="small-note mt-3" style="color: var(--success)">{{ status }}</p>
      <p v-if="error" class="small-note mt-3" style="color: var(--danger)">{{ error }}</p>
    </div>
  </section>
</template>
