<template>
  <div class="page-with-footer">
    <NavBar />

    <main class="container my-5" id="main-content" tabindex="-1">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-body p-4 p-md-5">
              <h1 class="h3 text-center mb-4">Вход в аккаунт</h1>

              <form @submit.prevent="handleLogin" novalidate>
                <div class="mb-3">
                  <label for="loginEmail" class="form-label">Email</label>
                  <input type="email" class="form-control" id="loginEmail" v-model="form.email"
                         placeholder="name@example.com" autocomplete="email" required />
                </div>

                <div class="mb-3">
                  <label for="loginPassword" class="form-label">Пароль</label>
                  <input type="password" class="form-control" id="loginPassword" v-model="form.password"
                         placeholder="Введите пароль" autocomplete="current-password" required />
                </div>

                <div v-if="error" class="text-danger small mb-3" role="alert">{{ error }}</div>

                <button type="submit" class="btn btn-primary-custom w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Войти
                </button>
              </form>

              <p class="text-center mt-3 small mb-0">
                Нет аккаунта? <router-link to="/register">Регистрация</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuth } from '@/composables'

const { login } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Введите email и пароль'
    return
  }

  loading.value = true
  try {
    const result = await login({
      email: form.email,
      password: form.password
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Неверный email или пароль'
    }
  } catch (err) {
    error.value = 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>