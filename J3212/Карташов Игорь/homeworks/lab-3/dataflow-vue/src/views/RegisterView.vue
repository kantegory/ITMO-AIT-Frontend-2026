<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register(form)
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
        <p class="text-muted">Create a new account</p>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form @submit.prevent="onSubmit">
        <div class="row mb-3">
          <div class="col-6">
            <label for="firstName" class="form-label">First Name</label>
            <input id="firstName" v-model="form.firstName" type="text" class="form-control" required />
          </div>
          <div class="col-6">
            <label for="lastName" class="form-label">Last Name</label>
            <input id="lastName" v-model="form.lastName" type="text" class="form-control" required />
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            minlength="8"
            required
          />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-brand w-100" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Account' }}
        </button>

        <p class="text-center mt-3">
          Already have an account?
          <RouterLink :to="{ name: 'login' }">Sign In</RouterLink>
        </p>
      </form>

      <div class="text-center mt-3">
        <ThemeToggle />
      </div>
    </main>
  </div>
</template>
