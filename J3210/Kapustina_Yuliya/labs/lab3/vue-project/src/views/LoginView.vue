<template>
  <div class="auth-wrapper">
    <section class="card login-card">
      <div class="card-body p-4">
        <h3 class="text-center mb-4">Вход</h3>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Имя пользователя или Email</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
              v-model="form.username"
              placeholder="Введите имя пользователя или email"
              @input="errors.username = ''"
            />
            <div class="invalid-feedback">{{ errors.username }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              v-model="form.password"
              placeholder="Введите пароль"
              @input="errors.password = ''"
            />
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>

          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="rememberMe" v-model="form.rememberMe" />
            <label class="form-check-label" for="rememberMe">Запомнить меня</label>
          </div>

          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <button type="submit" class="btn btn-main w-100 mb-3" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>

        <div class="text-center mb-3">
          <a href="#" class="text-decoration-none">Забыли пароль?</a>
        </div>

        <hr />

        <div class="text-center">
          <p>Нет аккаунта?</p>
          <router-link to="/register" class="btn btn-outline-main w-100">
            Регистрация
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  router.push('/')
}

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function validateForm() {
  let isValid = true

  if (!form.username) {
    errors.username = 'Введите имя пользователя или email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Введите пароль'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) return

  loading.value = true

  try {
    await login(form.username, form.password, form.rememberMe)
    successMessage.value = 'Вход выполнен! Перенаправление...'

    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: calc(100vh - 200px);
  background: linear-gradient(120deg, #ffb69e, #f8b8a4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 15px;
}

.login-card {
  width: 420px;
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>