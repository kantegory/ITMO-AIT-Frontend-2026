<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push({ name: 'pipelines' })
  } catch (err) {
    error.value = err.message || 'Server error. Is json-server running?'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <main class="auth-card">
      <div class="text-center mb-4">
        <i class="bi bi-diagram-3-fill text-brand" style="font-size: 2rem"></i>
        <h4 class="text-brand">DataFlow</h4>
        <p class="text-muted">Sign in to your account</p>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="you@company.com"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div class="form-check mb-3">
          <input id="remember" class="form-check-input" type="checkbox" />
          <label class="form-check-label" for="remember">Remember me</label>
        </div>

        <button type="submit" class="btn btn-brand w-100" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="text-center mt-3">
          Don't have an account?
          <RouterLink :to="{ name: 'register' }">Sign Up</RouterLink>
        </p>
      </form>

      <div class="text-center mt-3">
        <ThemeToggle />
      </div>
    </main>
  </div>
</template>
