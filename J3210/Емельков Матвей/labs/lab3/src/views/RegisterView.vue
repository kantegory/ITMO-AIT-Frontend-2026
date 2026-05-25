<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <section class="auth-card">
      <header class="auth-card__header">
        <h1 class="auth-card__title">{{ t('register.title') }}</h1>
        <p class="auth-card__subtitle">{{ t('register.subtitle') }}</p>
      </header>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">{{ t('register.name') }}</label>
          <input v-model="name" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('register.email') }}</label>
          <input v-model="email" type="email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('register.password') }}</label>
          <input v-model="password" type="password" class="form-control" required>
        </div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? t('register.loading') : t('register.submit') }}
        </button>
      </form>

      <footer class="mt-4 text-center">
        <span class="text-muted">{{ t('register.hasAccount') }}</span>
        <router-link to="/login" class="text-decoration-none"> {{ t('register.login') }}</router-link>
      </footer>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useLocale } from '../composables/useLocale'

const router = useRouter()
const { getUsers, createUser } = useApi()
const { t } = useLocale()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    const res = await getUsers({ email: email.value })
    if (res.data.length > 0) {
      error.value = t('register.emailExists')
      return
    }
    await createUser({ name: name.value, email: email.value, password: password.value })
    router.push('/login')
  } catch {
    error.value = t('common.serverError')
  } finally {
    loading.value = false
  }
}
</script>
