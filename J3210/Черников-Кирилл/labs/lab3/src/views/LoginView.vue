<template>
  <main id="main-content" role="main" class="container auth-layout d-flex align-items-center py-4 py-lg-5" tabindex="-1">
    <div class="row g-4 w-100 align-items-stretch">
      <div class="col-lg-6 fade-up">
        <section class="hero p-4 p-lg-5 h-100 d-flex flex-column justify-content-center">
          <span class="badge badge-soft rounded-pill align-self-start mb-3">ML Data Platform</span>
          <h1 class="display-6 fw-bold mb-3">Вход в платформу подготовки и аннотации данных</h1>
          <p class="text-secondary mb-4">
            Интерфейс работает с внешним моковым API: аккаунты, проекты, задачи и команда загружаются через <code>axios</code>.
          </p>
          <div class="side-note rounded p-3 text-secondary">
            Демо-доступ: <code>manager@dataforge.ru / password123</code> или <code>annotator@dataforge.ru / password123</code>.
          </div>
        </section>
      </div>

      <div class="col-lg-6 fade-up fade-up-delay">
        <section class="form-card p-4 p-lg-5">
          <h2 class="h3 mb-4">Вход</h2>
          <div v-if="alertMessage" class="alert alert-danger" role="status" aria-live="polite">
            {{ alertMessage }}
          </div>
          <form id="login-form" class="needs-validation" :class="{ 'was-validated': validated }" novalidate @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                required
                aria-required="true"
                placeholder="you@company.com"
                autocomplete="email"
                aria-describedby="login-email-feedback"
              />
              <div id="login-email-feedback" class="invalid-feedback">Введите корректный email.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Пароль</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                required
                aria-required="true"
                minlength="8"
                autocomplete="current-password"
                aria-describedby="login-password-feedback"
              />
              <div id="login-password-feedback" class="invalid-feedback">Минимум 8 символов.</div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe" />
                <label class="form-check-label" for="rememberMe">Запомнить меня</label>
              </div>
              <span class="small text-secondary">Авторизация через JSON Server</span>
            </div>
            <button
              id="login-submit"
              class="btn btn-brand w-100 py-2"
              type="submit"
              :disabled="loading"
              :aria-busy="loading ? 'true' : 'false'"
            >
              {{ loading ? 'Проверяем...' : 'Войти' }}
            </button>
          </form>
        </section>
      </div>
    </div>
  </main>

  <div class="modal fade" id="authSuccessModal" tabindex="-1" aria-labelledby="authSuccessTitle" aria-describedby="auth-success-text" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="authSuccessTitle" class="modal-title fs-5">Успешный вход</h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть" tabindex="-1"></button>
        </div>
        <div id="auth-success-text" class="modal-body">{{ successText }}</div>
        <div class="modal-footer">
          <RouterLink class="btn btn-brand" to="/dashboard" tabindex="-1">Открыть кабинет</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

const router = useRouter()
const { setSession } = useAuth()
const { get } = useApi()

const email = ref('')
const password = ref('')
const loading = ref(false)
const validated = ref(false)
const alertMessage = ref('')
const successText = ref('Сессия успешно создана. Перейдите в личный кабинет для работы с проектами.')

async function handleLogin() {
  validated.value = true
  alertMessage.value = ''

  const form = document.getElementById('login-form')
  if (!form.checkValidity()) return

  loading.value = true
  try {
    const users = await get('/users', { email: email.value.trim().toLowerCase() })
    const user = users.find((u) => u.password === password.value)

    if (!user) {
      throw new Error('Пользователь не найден. Проверьте email и пароль.')
    }

    setSession(user)
    successText.value = `Добро пожаловать, ${user.firstName} ${user.lastName}. Сессия создана, можно переходить в кабинет.`
    Modal.getOrCreateInstance(document.getElementById('authSuccessModal')).show()
    setTimeout(() => router.push('/dashboard'), 900)
  } catch (error) {
    alertMessage.value = error.message || 'Не удалось выполнить вход.'
  } finally {
    loading.value = false
  }
}
</script>
