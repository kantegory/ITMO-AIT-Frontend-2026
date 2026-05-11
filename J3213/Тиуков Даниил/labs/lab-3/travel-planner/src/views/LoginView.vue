<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const { showToast } = useToast()

const form = reactive({ email: '', password: '', remember: false })
const errors = ref({})
const alertState = ref({ type: '', message: '' })
const isSubmitting = ref(false)

function validate() {
  const next = {}
  if (!form.email.trim()) next.email = 'Укажите email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Введите корректный email.'
  if (!form.password.trim()) next.password = 'Введите пароль.'
  else if (form.password.length < 6) next.password = 'Пароль должен содержать минимум 6 символов.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function onSubmit() {
  alertState.value = { type: '', message: '' }
  if (!validate()) return

  isSubmitting.value = true
  try {
    const result = await login({ email: form.email.trim(), password: form.password })
    if (!result.ok) {
      alertState.value = { type: 'danger', message: result.message }
      return
    }
    alertState.value = { type: 'success', message: 'Вход выполнен успешно. Переходим в личный кабинет...' }
    showToast('Вход выполнен успешно', 'success')
    const redirect = route.query.redirect || '/dashboard'
    setTimeout(() => router.push(redirect), 800)
  } catch (error) {
    alertState.value = { type: 'danger', message: 'Не удалось связаться с сервером. Попробуйте позже.' }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-section">
    <div class="container">
      <div class="row g-4 align-items-center justify-content-center">
        <div class="col-lg-5">
          <div class="auth-card">
            <span class="section-badge"><i class="bi bi-box-arrow-in-right" /> Вход в систему</span>
            <h1 class="section-title-sm">Вход в аккаунт</h1>
            <p class="section-text mb-4">Авторизуйтесь, чтобы открыть личный кабинет, маршруты, заметки и совместное планирование поездок.</p>

            <div
              v-if="alertState.message"
              class="alert"
              :class="`alert-${alertState.type}`"
              role="alert"
              aria-live="assertive"
            >
              {{ alertState.message }}
            </div>

            <form novalidate @submit.prevent="onSubmit">
              <div class="mb-3">
                <label class="form-label" for="loginEmail">Email</label>
                <input
                  id="loginEmail"
                  v-model="form.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="loginPassword">Пароль</label>
                <input
                  id="loginPassword"
                  v-model="form.password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  type="password"
                  placeholder="Минимум 6 символов"
                  autocomplete="current-password"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="form-check mb-4">
                <input id="rememberMe" v-model="form.remember" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="rememberMe">Запомнить меня</label>
              </div>
              <button class="btn btn-primary w-100" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Входим…' : 'Войти' }}
              </button>
            </form>

            <p class="text-secondary mt-4 mb-0">
              Нет аккаунта?
              <RouterLink to="/register">Зарегистрироваться</RouterLink>
            </p>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="auth-card">
            <img
              class="auth-illustration"
              src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80"
              alt="Атмосфера путешествий — вид на горы и природу"
            />
            <h2 class="section-title-sm">Что откроется после входа</h2>
            <p class="section-text">После входа откроется личный кабинет, маршруты, заметки и раздел совместного планирования поездок.</p>
            <div class="benefit-list">
              <div class="benefit-item">
                <i class="bi bi-journal-text" />
                <div>
                  <h3 class="h6 mb-1">Доступ к заметкам</h3>
                  <p class="text-secondary mb-0">Сохраняйте идеи, адреса и планы по каждому путешествию.</p>
                </div>
              </div>
              <div class="benefit-item">
                <i class="bi bi-map" />
                <div>
                  <h3 class="h6 mb-1">Сохранённые маршруты</h3>
                  <p class="text-secondary mb-0">Возвращайтесь к готовым планам и редактируйте их в любое время.</p>
                </div>
              </div>
              <div class="benefit-item">
                <i class="bi bi-people" />
                <div>
                  <h3 class="h6 mb-1">Совместное планирование</h3>
                  <p class="text-secondary mb-0">Добавляйте участников и обсуждайте детали поездки в общей рабочей зоне.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
