<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'

const router = useRouter()
const { register } = useAuth()
const { showToast } = useToast()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})
const errors = ref({})
const submitError = ref('')
const isSubmitting = ref(false)
const showSuccessModal = ref(false)

function validate() {
  const next = {}
  if (!form.firstName.trim()) next.firstName = 'Введите имя.'
  if (!form.lastName.trim()) next.lastName = 'Введите фамилию.'
  if (!form.email.trim()) next.email = 'Укажите email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Введите корректный email.'
  if (!form.password) next.password = 'Введите пароль.'
  else if (form.password.length < 6) next.password = 'Пароль должен содержать минимум 6 символов.'
  if (!form.confirmPassword) next.confirmPassword = 'Повторите пароль.'
  else if (form.password !== form.confirmPassword) next.confirmPassword = 'Пароли должны совпадать.'
  if (!form.agreement) next.agreement = 'Необходимо согласиться с правилами.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function onSubmit() {
  submitError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    const result = await register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password
    })
    if (!result.ok) {
      submitError.value = result.message
      return
    }
    showToast('Регистрация завершена', 'success')
    showSuccessModal.value = true
  } catch (error) {
    submitError.value = 'Не удалось связаться с сервером. Попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}

function goToDashboard() {
  showSuccessModal.value = false
  router.push('/dashboard')
}

function goToLogin() {
  showSuccessModal.value = false
  router.push('/login')
}
</script>

<template>
  <section class="auth-section">
    <div class="container">
      <div class="row g-4 align-items-start justify-content-center">
        <div class="col-lg-7">
          <div class="auth-card">
            <span class="section-badge"><i class="bi bi-person-plus" /> Новый аккаунт</span>
            <h1 class="section-title-sm">Регистрация пользователя</h1>
            <p class="section-text mb-4">Создайте аккаунт, чтобы сохранять маршруты, избранные направления и работать над поездкой совместно.</p>

            <div v-if="submitError" class="alert alert-danger" role="alert">{{ submitError }}</div>

            <form novalidate @submit.prevent="onSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="firstName">Имя</label>
                  <input id="firstName" v-model="form.firstName" class="form-control" :class="{ 'is-invalid': errors.firstName }" type="text" />
                  <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="lastName">Фамилия</label>
                  <input id="lastName" v-model="form.lastName" class="form-control" :class="{ 'is-invalid': errors.lastName }" type="text" />
                  <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="registerEmail">Email</label>
                  <input id="registerEmail" v-model="form.email" class="form-control" :class="{ 'is-invalid': errors.email }" type="email" placeholder="you@example.com" />
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="registerPassword">Пароль</label>
                  <input id="registerPassword" v-model="form.password" class="form-control" :class="{ 'is-invalid': errors.password }" type="password" placeholder="Минимум 6 символов" />
                  <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="confirmPassword">Подтверждение пароля</label>
                  <input id="confirmPassword" v-model="form.confirmPassword" class="form-control" :class="{ 'is-invalid': errors.confirmPassword }" type="password" />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input id="agreeRules" v-model="form.agreement" class="form-check-input" :class="{ 'is-invalid': errors.agreement }" type="checkbox" />
                    <label class="form-check-label" for="agreeRules">Согласен с правилами использования учебного приложения</label>
                    <div v-if="errors.agreement" class="invalid-feedback d-block">{{ errors.agreement }}</div>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary w-100 mt-4" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Создаём аккаунт…' : 'Зарегистрироваться' }}
              </button>
            </form>

            <p class="text-secondary mt-4 mb-0">
              Уже есть аккаунт?
              <RouterLink to="/login">Войти</RouterLink>
            </p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="auth-card">
            <img
              class="auth-illustration"
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80"
              alt="Travel register"
            />
            <h2 class="section-title-sm">Почему стоит зарегистрироваться</h2>
            <div class="benefit-list">
              <div class="benefit-item">
                <i class="bi bi-bookmark-heart" />
                <div>
                  <h3 class="h6 mb-1">Избранные направления</h3>
                  <p class="text-secondary mb-0">Сохраняйте интересные точки каталога и возвращайтесь к ним позже.</p>
                </div>
              </div>
              <div class="benefit-item">
                <i class="bi bi-luggage" />
                <div>
                  <h3 class="h6 mb-1">Личные маршруты</h3>
                  <p class="text-secondary mb-0">Собирайте поездки по дням и связывайте их с выбранными направлениями.</p>
                </div>
              </div>
              <div class="benefit-item">
                <i class="bi bi-chat-dots" />
                <div>
                  <h3 class="h6 mb-1">Работа в группе</h3>
                  <p class="text-secondary mb-0">Добавляйте участников, заметки и идеи для совместных поездок.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showSuccessModal" class="modal-backdrop-custom" @click.self="showSuccessModal = false">
    <div class="modal-dialog-custom">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Регистрация завершена</h2>
        <button type="button" class="btn-close" aria-label="Закрыть" @click="showSuccessModal = false" />
      </div>
      <p class="mb-4">Аккаунт успешно создан. Можно сразу перейти в личный кабинет.</p>
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-primary" @click="goToLogin">Перейти ко входу</button>
        <button type="button" class="btn btn-primary" @click="goToDashboard">Перейти в кабинет</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}
.modal-dialog-custom {
  background: var(--tp-surface, #fff);
  color: var(--tp-text, #0f172a);
  border-radius: var(--tp-radius-md, 1rem);
  padding: 1.5rem;
  width: min(540px, 100%);
  box-shadow: var(--tp-shadow, 0 30px 60px rgba(15, 23, 42, 0.25));
}
</style>
