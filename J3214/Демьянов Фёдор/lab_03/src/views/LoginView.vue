<template>
  <div>
    <!-- Кнопка возврата -->
    <div class="position-absolute top-0 start-0 p-4 z-3">
      <router-link
        to="/"
        class="nav-link d-inline-flex align-items-center gap-2 letter-spacing-2 text-uppercase fs-7"
        aria-label="Вернуться на главную страницу NovaTransit"
      >
        <svg class="icon" aria-hidden="true" focusable="false">
          <use href="#icon-arrow-left"></use>
        </svg>
        На главную
      </router-link>
    </div>

    <!-- Тумблер темы -->
    <div class="position-absolute top-0 end-0 p-4 z-3">
      <ThemeToggle />
    </div>

    <main class="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div class="glass-panel p-4 p-md-5 w-100" style="max-width: 450px;">
        <div class="text-center mb-4">
          <svg class="icon icon-logo-lg mb-3" aria-hidden="true" focusable="false">
            <use href="#icon-logo"></use>
          </svg>
          <h1 class="fw-bold mb-1 letter-spacing-2 fs-2">ВХОД</h1>
          <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase">Терминал авторизации</p>
        </div>

        <form @submit.prevent="handleLogin" :class="{ 'was-validated': wasValidated }" novalidate>
          <div class="mb-4">
            <label for="email" class="form-label">Бортовой Email</label>
            <input
              type="email"
              class="form-control glass-input shadow-none"
              id="email"
              v-model="email"
              placeholder="commander@novatransit.com"
              required
            >
            <div class="invalid-feedback fs-7">Укажите корректный адрес электронной почты.</div>
          </div>

          <div class="mb-4">
            <label for="password" class="form-label">Ключ доступа (Пароль)</label>
            <input
              type="password"
              class="form-control glass-input shadow-none"
              id="password"
              v-model="password"
              placeholder="••••••••"
              required
              minlength="6"
            >
            <div class="invalid-feedback fs-7">Пароль должен содержать не менее 6 символов.</div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-4" role="alert">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-accent w-100 py-3 mb-4 letter-spacing-2 fs-7"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Авторизация...' : 'Войти в систему' }}
          </button>

          <p class="text-center text-muted-custom fs-7 mb-0">
            Нет допуска?
            <router-link
              to="/register"
              class="text-main fw-medium text-decoration-none border-bottom border-secondary pb-1 ms-1"
            >
              Зарегистрироваться
            </router-link>
          </p>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from '../components/common/ThemeToggle.vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const wasValidated = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  if (!email.value || password.value.length < 6) {
    wasValidated.value = true
    return
  }

  isLoading.value = true
  try {
    await login(email.value.trim(), password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>