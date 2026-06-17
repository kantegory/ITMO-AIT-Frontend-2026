<template>
  <BaseLayout>
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-5">
        <div class="info-panel">
          <span class="chip bg-white text-primary mb-3">Страница входа</span>
          <h2 class="fw-bold mb-3">Вход в систему</h2>
          <p class="mb-0 opacity-75">
            Форма авторизации подключена к моковому API на JSON Server. После
            успешного входа открывается личный кабинет пользователя.
          </p>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="auth-card">
          <h2 class="section-title h3 mb-2">Добро пожаловать</h2>
          <p class="text-secondary mb-4">Введите e-mail и пароль</p>

          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label" for="loginEmail">E-mail</label>
              <input
                id="loginEmail"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                class="form-control form-control-lg rounded-4"
                placeholder="anna@mail.ru"
                required
              />
            </div>

            <div class="mb-3">
              <PasswordField
                id="loginPassword"
                v-model="form.password"
                label="Пароль"
                placeholder="Введите пароль"
                autocomplete="current-password"
              />
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input id="rememberMe" class="form-check-input" type="checkbox" v-model="form.rememberMe" />
                <label class="form-check-label" for="rememberMe">Запомнить меня</label>
              </div>
              <span class="text-decoration-none text-secondary">Забыли пароль?</span>
            </div>

            <button class="btn btn-primary btn-lg w-100 rounded-pill" type="submit" :disabled="loading">
              {{ loading ? 'Входим...' : 'Войти' }}
            </button>
          </form>

          <div class="text-center mt-4 text-secondary">
            Нет аккаунта?
            <RouterLink class="text-decoration-none" to="/register">Зарегистрироваться</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import PasswordField from '@/components/PasswordField.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const uiStore = useUiStore()
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: true
})

async function submitForm() {
  loading.value = true

  try {
    const user = await authStore.login(form)
    await financeStore.loadAll(user.id)
    uiStore.showToast('Вход выполнен')
    router.push('/dashboard')
  } catch (error) {
    uiStore.showToast(error.message || 'Не удалось подключиться к серверу')
  } finally {
    loading.value = false
  }
}
</script>
