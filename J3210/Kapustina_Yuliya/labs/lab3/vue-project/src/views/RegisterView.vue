<template>
  <div class="auth-wrapper">
    <main>
      <section class="card register-card">
        <header class="card-body text-center pb-0">
          <h2>Создать аккаунт</h2>
          <p class="text-muted">Присоединяйтесь к сообществу фанфиков</p>
        </header>

        <section class="card-body">
          <form @submit.prevent="handleRegister">
            <section class="mb-3">
              <label class="form-label">Имя пользователя</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                v-model="form.username"
                placeholder="Введите ник"
                @input="errors.username = ''"
              />
              <div class="invalid-feedback">{{ errors.username }}</div>
            </section>

            <section class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-model="form.email"
                placeholder="example@email.com"
                @input="errors.email = ''"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </section>

            <section class="mb-3">
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
            </section>

            <section class="mb-3">
              <label class="form-label">Подтверждение пароля</label>
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="form.confirmPassword"
                placeholder="Повторите пароль"
                @input="errors.confirmPassword = ''"
              />
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
            </section>

            <section class="form-check mb-3">
              <input
                type="checkbox"
                class="form-check-input"
                :class="{ 'is-invalid': errors.agreeTerms }"
                id="agreeTerms"
                v-model="form.agreeTerms"
                @change="errors.agreeTerms = ''"
              />
              <label class="form-check-label" for="agreeTerms">
                Я принимаю
                <a href="/user_agreement.txt" target="_blank">пользовательское соглашение</a>
              </label>
              <div class="invalid-feedback">{{ errors.agreeTerms }}</div>
            </section>

            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <footer>
              <button type="submit" class="btn btn-main w-100 mb-3" :disabled="loading">
                {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
            </footer>
          </form>

          <hr />

          <p class="text-center">
            Уже есть аккаунт?
            <router-link to="/login">Войти</router-link>
          </p>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  router.push('/')
}

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function validateForm() {
  let isValid = true

  if (!form.username) {
    errors.username = 'Имя пользователя обязательно'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Имя пользователя должно быть не менее 3 символов'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email обязателен'
    isValid = false
  } else if (!form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Введите корректный email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Пароль обязателен'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = 'Необходимо принять пользовательское соглашение'
    isValid = false
  }

  return isValid
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) return

  loading.value = true

  try {
    await register(form.username, form.email, form.password)
    successMessage.value = 'Регистрация успешна! Перенаправление...'

    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  background: linear-gradient(120deg, #ffb69e, #f8b8a4);
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 15px;
}

.register-card {
  max-width: 500px;
  width: 100%;
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>