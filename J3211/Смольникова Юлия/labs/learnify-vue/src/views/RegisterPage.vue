<template>
  <div class="page-with-footer">
    <NavBar />

    <main class="container my-5" id="main-content" tabindex="-1">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-body p-4 p-md-5">
              <h1 class="h3 text-center mb-4">Регистрация</h1>

              <form @submit.prevent="handleRegister" novalidate>
                <div class="mb-3">
                  <label for="registerName" class="form-label">Имя</label>
                  <input type="text" class="form-control" id="registerName" v-model="form.name"
                         placeholder="Ваше имя" autocomplete="name" required />
                </div>

                <div class="mb-3">
                  <label for="registerEmail" class="form-label">Email</label>
                  <input type="email" class="form-control" id="registerEmail" v-model="form.email"
                         placeholder="name@example.com" autocomplete="email" required />
                </div>

                <div class="mb-3">
                  <label for="registerPassword" class="form-label">Пароль</label>
                  <input type="password" class="form-control" id="registerPassword" v-model="form.password"
                         placeholder="Минимум 6 символов" autocomplete="new-password" required minlength="6" />
                </div>

                <div class="mb-3">
                  <label for="registerPasswordConfirm" class="form-label">Подтвердите пароль</label>
                  <input type="password" class="form-control" id="registerPasswordConfirm" v-model="form.passwordConfirm"
                         placeholder="Повторите пароль" autocomplete="new-password" required />
                </div>

                <div v-if="error" class="text-danger small mb-3" role="alert">{{ error }}</div>
                <div v-if="success" class="text-success small mb-3" role="status">{{ success }}</div>

                <button type="submit" class="btn btn-primary-custom w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Зарегистрироваться
                </button>
              </form>

              <p class="text-center mt-3 small mb-0">
                Уже есть аккаунт? <router-link to="/login">Войти</router-link>
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''

  if (!form.name || !form.email || !form.password) {
    error.value = 'Заполните все поля'
    return
  }
  if (form.password !== form.passwordConfirm) {
    error.value = 'Пароли не совпадают'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  loading.value = true
  try {
    await auth.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
      role: 'student'
    })
    success.value = 'Регистрация успешна! Перенаправляем...'
    setTimeout(() => router.push('/dashboard'), 1000)
  } catch (err) {
    error.value = err.response?.data?.message || err.response?.data?.error || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>