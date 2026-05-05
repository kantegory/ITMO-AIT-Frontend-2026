<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'

const router = useRouter()
const authStore = useAuthStore()
const modalStore = useModalStore()

const form = reactive({
  email: '',
  password: ''
})

async function login() {
  try {
    await authStore.login(form.email, form.password)
    modalStore.openInfo('Добро пожаловать', 'Вы успешно вошли в систему.')
    setTimeout(() => {
      router.push({ name: 'account' })
      modalStore.close()
    }, 900)
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}
</script>

<template>
  <BaseLayout>
    <main class="container mt-4">
      <div class="row align-items-center justify-content-between g-4">
        <div class="col-12 col-lg-6">
          <h1 class="fw-bold hero-title">Мои прекрасные расходы</h1>
          <p class="lead hero-subtitle px-3 px-lg-0">Ваш надёжный помощник в управлении личными финансами и бюджетом.</p>
          <div class="features-grid">
            <div class="feature-tile"><span>Личный кабинет</span></div>
            <div class="feature-tile"><span>Поиск и фильтрация транзакций</span></div>
            <div class="feature-tile"><span>Отчёты и прогнозы</span></div>
            <div class="feature-tile"><span>Интеграция с аккаунтами</span></div>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 id="login-form-title" class="card-title text-center mb-4">Вход в аккаунт</h2>
              <form aria-labelledby="login-form-title" role="region" @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email адрес</label>
                  <input id="email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    autocomplete="current-password"
                    required
                  />
                </div>
                <div class="d-flex justify-content-end mb-3">
                  <RouterLink :to="{ name: 'forgot-password' }" class="small text-decoration-none">Забыли пароль?</RouterLink>
                </div>
                <div class="d-grid gap-4">
                  <button type="submit" class="btn btn-primary btn-custom">Войти</button>
                </div>
              </form>
              <div class="d-flex flex-column flex-sm-row align-items-center gap-3 mt-3 mx-sm-5">
                <span class="mb-0 text-nowrap">Нет аккаунта?</span>
                <RouterLink :to="{ name: 'register' }" class="btn btn-outline-secondary btn-custom flex-grow-1 w-100 w-sm-auto">
                  Зарегистрируйтесь!
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
