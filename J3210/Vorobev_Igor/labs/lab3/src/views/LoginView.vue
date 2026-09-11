<template>
  <div class="auth-page">
    <header class="landing-header">
      <ThemeToggle />
    </header>

    <main class="auth-wrapper">
      <section class="card auth-card" aria-labelledby="loginTitle">
        <div class="card-body p-4">
          <h1 id="loginTitle" class="auth-title">Вход</h1>

          <AppAlert :message="error" @close="error = ''" />

          <form @submit.prevent="submit">
            <div class="form-floating mb-3">
              <input id="floatingEmail" v-model.trim="email" type="email" class="form-control" placeholder="Email" autocomplete="email" required />
              <label for="floatingEmail">Email</label>
            </div>

            <div class="form-floating mb-4">
              <input id="floatingPassword" v-model="password" type="password" class="form-control" placeholder="Пароль" autocomplete="current-password" required />
              <label for="floatingPassword">Пароль</label>
            </div>

            <button class="btn btn-outline-black w-100 py-2 fw-bold" type="submit" :disabled="loading">
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>
          </form>

          <div class="auth-links">
            <RouterLink to="/">← Назад</RouterLink>
            <span class="mx-2">|</span>
            <RouterLink to="/register">Регистрация</RouterLink>
          </div>

          <p class="demo-hint mb-0 mt-3">Тестовый вход: alexey@example.com / 123456</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AppAlert from '@/components/AppAlert.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Пароль минимум 6 символов'
    return
  }

  loading.value = true
  try {
    await login(email.value, password.value)
    await router.push({ name: 'projects' })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
