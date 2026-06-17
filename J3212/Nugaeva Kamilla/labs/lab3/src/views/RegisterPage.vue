<template>
  <div class="auth-layout">
    <div class="auth-card">
      <span class="page-kicker">Создание аккаунта</span>

      <h1 class="page-title">Регистрация</h1>

      <p class="page-subtitle mb-4">
        Создайте аккаунт, чтобы сохранять маршруты, заметки и делиться планами поездок.
      </p>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="registerName" class="form-label">Имя</label>
          <input
            id="registerName"
            v-model.trim="form.name"
            type="text"
            class="form-control"
            placeholder="Введите имя"
            autocomplete="name"
            required
          />
        </div>

        <div class="mb-3">
          <label for="registerEmail" class="form-label">Email</label>
          <input
            id="registerEmail"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            placeholder="name@example.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="registerPassword" class="form-label">Пароль</label>
          <input
            id="registerPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Введите пароль"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="mb-4">
          <label for="registerPassword2" class="form-label">Повторите пароль</label>
          <input
            id="registerPassword2"
            v-model="form.passwordRepeat"
            type="password"
            class="form-control"
            placeholder="Повторите пароль"
            autocomplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <hr class="my-4" />

      <p class="mb-0 small">
        Уже есть аккаунт?
        <RouterLink to="/login">Войти</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordRepeat: '',
})

function validateForm() {
  if (form.password.length < 6) {
    throw new Error('Пароль должен быть не короче 6 символов.')
  }

  if (form.password !== form.passwordRepeat) {
    throw new Error('Пароли не совпадают.')
  }
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    validateForm()

    isLoading.value = true

    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    })

    successMessage.value = 'Аккаунт создан. Сейчас можно войти.'

    setTimeout(() => {
      router.push('/login')
    }, 700)
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось создать аккаунт.'
  } finally {
    isLoading.value = false
  }
}
</script>