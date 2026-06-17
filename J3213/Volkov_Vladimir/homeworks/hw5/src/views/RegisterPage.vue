<template>
  <BaseLayout>
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-5">
        <div class="info-panel">
          <span class="chip bg-white text-primary mb-3">Страница регистрации</span>
          <h2 class="fw-bold mb-3">Создание аккаунта</h2>
          <p class="mb-0 opacity-75">
            Зарегистрируйтесь, чтобы получить доступ к личному кабинету, управлению
            счетами, просмотру транзакций, бюджетам и финансовым отчётам.
          </p>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="auth-card">
          <h2 class="section-title h3 mb-2">Регистрация</h2>
          <p class="text-secondary mb-4">Заполните данные пользователя</p>

          <form class="row g-3" @submit.prevent="submitForm">
            <div class="col-md-6">
              <label class="form-label" for="firstName">Имя</label>
              <input
                id="firstName"
                v-model.trim="form.firstName"
                type="text"
                autocomplete="given-name"
                class="form-control form-control-lg rounded-4"
                placeholder="Анна"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="lastName">Фамилия</label>
              <input
                id="lastName"
                v-model.trim="form.lastName"
                type="text"
                autocomplete="family-name"
                class="form-control form-control-lg rounded-4"
                placeholder="Иванова"
                required
              />
            </div>

            <div class="col-12">
              <label class="form-label" for="registerEmail">E-mail</label>
              <input
                id="registerEmail"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                class="form-control form-control-lg rounded-4"
                placeholder="anna@mail.ru"
                required
              />
            </div>

            <div class="col-md-6">
              <PasswordField
                id="registerPassword"
                v-model="form.password"
                label="Пароль"
                placeholder="Создайте пароль"
                autocomplete="new-password"
              />
            </div>

            <div class="col-md-6">
              <PasswordField
                id="confirmPassword"
                v-model="form.confirmPassword"
                label="Повторите пароль"
                placeholder="Повторите пароль"
                autocomplete="new-password"
              />
            </div>

            <div class="col-12">
              <div class="form-check">
                <input id="agree" v-model="form.agree" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="agree">
                  Я согласен(на) с условиями использования сервиса
                </label>
              </div>
            </div>

            <div class="col-12 d-flex gap-3 flex-wrap pt-2">
              <button class="btn btn-primary btn-lg rounded-pill px-4" type="submit" :disabled="loading">
                {{ loading ? 'Создаём...' : 'Зарегистрироваться' }}
              </button>
              <RouterLink class="btn btn-outline-secondary btn-lg rounded-pill px-4" to="/login">
                У меня уже есть аккаунт
              </RouterLink>
            </div>
          </form>
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
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

async function submitForm() {
  if (form.password !== form.confirmPassword) {
    uiStore.showToast('Пароли не совпадают')
    return
  }

  if (!form.agree) {
    uiStore.showToast('Подтвердите согласие с условиями')
    return
  }

  loading.value = true

  try {
    const createdUser = await authStore.register(form)
    await financeStore.ensureUserFinancialData(createdUser.id)
    uiStore.showToast('Регистрация прошла успешно')
    router.push('/login')
  } catch (error) {
    uiStore.showToast(error.message || 'Ошибка при регистрации')
  } finally {
    loading.value = false
  }
}
</script>
