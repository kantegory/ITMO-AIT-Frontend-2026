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
      <div class="glass-panel p-4 p-md-5 w-100" style="max-width: 480px;">
        <div class="text-center mb-4">
          <svg class="icon icon-logo-lg mb-3" aria-hidden="true" focusable="false">
            <use href="#icon-logo"></use>
          </svg>
          <h1 class="fw-bold mb-1 letter-spacing-2 fs-2">РЕГИСТРАЦИЯ</h1>
          <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase">Регистрация кандидата</p>
        </div>

        <form @submit.prevent="handleRegister" :class="{ 'was-validated': wasValidated }" novalidate>
          <div class="mb-4">
            <label for="name" class="form-label">Позывной или ФИО</label>
            <input
              type="text"
              class="form-control glass-input shadow-none"
              id="name"
              v-model="name"
              placeholder="John Doe"
              required
              minlength="2"
            >
            <div class="invalid-feedback fs-7">Укажите ваш позывной или полное имя.</div>
          </div>

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
            <div class="invalid-feedback fs-7">Минимальная длина пароля — 6 символов.</div>
          </div>

          <div class="mb-4">
            <label for="passwordConfirm" class="form-label">Подтверждение ключа</label>
            <input
              type="password"
              class="form-control glass-input shadow-none"
              id="passwordConfirm"
              v-model="passwordConfirm"
              placeholder="••••••••"
              required
            >
            <div v-if="passwordMismatch" class="text-danger fs-7 mt-1">
              Введенные ключи доступа не совпадают.
            </div>
          </div>

          <div class="form-check mb-5">
            <input
              class="form-check-input shadow-none"
              type="checkbox"
              id="rules"
              v-model="rulesAccepted"
              required
            >
            <label class="form-check-label text-muted-custom fs-7" for="rules">
              Согласен с регламентом суборбитальных и межпланетных полетов
            </label>
            <div class="invalid-feedback fs-7">Необходимо подтвердить согласие с регламентом.</div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-4" role="alert">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-accent w-100 py-3 mb-4 letter-spacing-2 fs-7"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Регистрация...' : 'Создать досье' }}
          </button>

          <p class="text-center text-muted-custom fs-7 mb-0">
            Уже зарегистрированы?
            <router-link
              to="/login"
              class="text-main fw-medium text-decoration-none border-bottom border-secondary pb-1 ms-1"
            >
              Войти
            </router-link>
          </p>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from '../components/common/ThemeToggle.vue'

const router = useRouter()
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const rulesAccepted = ref(false)
const wasValidated = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const passwordMismatch = computed(() => {
  return passwordConfirm.value.length > 0 && password.value !== passwordConfirm.value
})

const handleRegister = async () => {
  errorMessage.value = ''
  if (!name.value || !email.value || password.value.length < 6 || passwordMismatch.value || !rulesAccepted.value) {
    wasValidated.value = true
    return
  }

  isLoading.value = true
  try {
    await register(name.value.trim(), email.value.trim(), password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>