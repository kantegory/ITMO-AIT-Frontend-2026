<template>
  <div class="modal fade" ref="modalRef" tabindex="-1"
       aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0">
          <h3 class="modal-title fw-bold" id="loginModalLabel">
            <svg class="icon icon-lg text-primary me-2" aria-hidden="true">
              <use href="#icon-right-to-bracket"></use>
            </svg>
            Вход в аккаунт
          </h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Закрыть окно входа"></button>
        </div>
        <div class="modal-body pt-4">
          <form @submit.prevent="handleLogin" novalidate>
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="loginEmail"
                     v-model="email" placeholder="name@example.com"
                     autocomplete="email" aria-required="true" required>
              <div class="invalid-feedback">Пожалуйста, введите корректный email</div>
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Пароль</label>
              <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control"
                       id="loginPassword" v-model="password" placeholder="••••••••"
                       autocomplete="current-password" aria-required="true" required minlength="6">
                <button class="btn btn-outline-secondary" type="button"
                        @click="showPassword = !showPassword"
                        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'">
                  <svg class="icon icon-lg" aria-hidden="true">
                    <use :href="showPassword ? '#icon-eye-slash' : '#icon-eye'"></use>
                  </svg>
                </button>
                <div class="invalid-feedback">Пароль должен содержать минимум 6 символов</div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe"
                       v-model="rememberMe">
                <label class="form-check-label" for="rememberMe">Запомнить меня</label>
              </div>
              <a href="#" class="text-decoration-none text-primary small">Забыли пароль?</a>
            </div>
            <button type="submit" class="btn btn-primary w-100 py-2" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"
                    role="status"></span>
              <svg v-else class="icon icon-lg me-2" aria-hidden="true">
                <use href="#icon-right-to-bracket"></use>
              </svg>
              Войти
            </button>
            <div v-if="error" class="alert alert-danger mt-3 py-2 small">{{ error }}</div>
          </form>
          <div class="text-center mt-4">
            <span class="text-muted small">Нет аккаунта?</span>
            <button class="btn btn-link text-decoration-none p-0 ms-1"
                    @click="$emit('switch-to-register')"
                    aria-label="Перейти к регистрации">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {Modal} from 'bootstrap'
import {useAuth} from '@/composables/useAuth'
import {useToast} from '@/composables/useToast'

const {login} = useAuth()
const {showToast} = useToast()

const visible = defineModel({type: Boolean, default: false})
const modalRef = ref(null)
let modalInstance = null

watch(visible, (val) => {
  if (val) {
    modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  } else if (modalInstance) {
    modalInstance.hide()
  }
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  loading.value = true
  try {
    await login(email.value, password.value)
    showToast('Успешный вход!', 'success')
    visible.value = false
    email.value = ''
    password.value = ''
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
