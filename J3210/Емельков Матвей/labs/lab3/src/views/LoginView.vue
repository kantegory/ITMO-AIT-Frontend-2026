<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <section class="auth-card">
      <header class="auth-card__header">
        <h1 class="auth-card__title">{{ t('login.title') }}</h1>
        <p class="auth-card__subtitle">{{ t('login.subtitle') }}</p>
      </header>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">{{ t('login.email') }}</label>
          <input v-model="email" type="email" class="form-control" id="email" :placeholder="t('login.emailPlaceholder')" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">{{ t('login.password') }}</label>
          <input v-model="password" type="password" class="form-control" id="password" :placeholder="t('login.passwordPlaceholder')" required>
        </div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? t('login.loading') : t('login.submit') }}
        </button>
      </form>

      <footer class="mt-4 text-center">
        <span class="text-muted">{{ t('login.noAccount') }}</span>
        <router-link to="/register" class="text-decoration-none"> {{ t('login.register') }}</router-link>
      </footer>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'
import { useLocale } from '../composables/useLocale'

const router = useRouter()
const { login } = useAuth()
const { getUsers } = useApi()
const { t } = useLocale()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await getUsers({ email: email.value })
    const user = res.data.find(u => u.password === password.value)
    if (!user) {
      error.value = t('login.invalidCredentials')
      return
    }
    login(user)
    router.push('/')
  } catch {
    error.value = t('common.serverError')
  } finally {
    loading.value = false
  }
}
</script>
