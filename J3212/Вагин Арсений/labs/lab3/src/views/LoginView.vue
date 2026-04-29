<template>
  <div class="container my-5 flex-grow-1 d-flex align-items-center">
    <div class="row justify-content-center w-100">
      <div class="col-md-6 col-lg-5">
        <div class="auth-card">
          <h2 class="text-center mb-5">Sign In</h2>

          <div v-if="errorMessage" class="alert alert-danger py-2 small" role="alert">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="form-label text-muted small text-uppercase" for="emailInput">Email</label>
              <input type="email" class="form-control" id="emailInput" v-model="email" required placeholder="your@email.com">
            </div>
            
            <div class="mb-5">
              <label class="form-label text-muted small text-uppercase d-flex justify-content-between" for="passwordInput">
                <span>Пароль</span>
                <a href="#" class="text-muted text-decoration-none text-lowercase">forgot?</a>
              </label>
              <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control border-end-0" id="passwordInput" v-model="password" required minlength="4" placeholder="Min 4 characters">
                <button class="btn border border-start-0 bg-white text-muted" type="button" @click="showPassword = !showPassword" id="togglePassword">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary-ca w-100 mb-3" :disabled="isLoading">
              {{ isLoading ? 'Loading...' : 'Sign In' }}
            </button>
          </form>

          <div class="text-center mt-4">
            <router-link to="/register" class="text-dark text-decoration-none small">Don't have an account? Register</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  const result = await login(email.value, password.value)
  if (!result.success) {
    errorMessage.value = result.error
  }
  
  isLoading.value = false
}
</script>