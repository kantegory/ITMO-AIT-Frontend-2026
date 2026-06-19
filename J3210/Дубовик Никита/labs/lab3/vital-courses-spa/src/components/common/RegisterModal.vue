<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0">
          <h3 class="modal-title fw-bold" id="registerModalLabel">
            <svg class="icon icon-lg text-primary me-2" aria-hidden="true"><use href="#icon-user-plus"></use></svg>Создать аккаунт
          </h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть окно регистрации"></button>
        </div>
        <div class="modal-body pt-4">
          <form @submit.prevent="handleRegister" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="registerName" class="form-label">Имя</label>
                <input type="text" class="form-control" id="registerName" v-model="firstName" placeholder="Никита" autocomplete="given-name" aria-required="true" required>
                <div class="invalid-feedback" :class="{ 'd-block': submitted && !firstName }">Пожалуйста, введите ваше имя</div>
              </div>
              <div class="col-md-6">
                <label for="registerSurname" class="form-label">Фамилия</label>
                <input type="text" class="form-control" id="registerSurname" v-model="lastName" placeholder="Дубовик" autocomplete="family-name" aria-required="true" required>
                <div class="invalid-feedback" :class="{ 'd-block': submitted && !lastName }">Пожалуйста, введите вашу фамилию</div>
              </div>
            </div>
            <div class="mb-3 mt-3">
              <label for="registerEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="registerEmail" v-model="email" placeholder="name@example.com" autocomplete="email" aria-required="true" required>
              <div class="invalid-feedback" :class="{ 'd-block': submitted && (!email || !email.includes('@')) }">Пожалуйста, введите корректный email</div>
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label">Пароль</label>
              <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" id="registerPassword" v-model="password" placeholder="Минимум 6 символов" autocomplete="new-password" aria-required="true" required minlength="6">
                <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'">
                  <svg class="icon icon-lg" aria-hidden="true"><use :href="showPassword ? '#icon-eye-slash' : '#icon-eye'"></use></svg>
                </button>
                <div class="invalid-feedback" :class="{ 'd-block': submitted && password.length < 6 }">Пароль должен содержать минимум 6 символов</div>
              </div>
              <div class="form-text small">
                <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-circle-info"></use></svg>
                Используйте буквы, цифры и специальные символы
                <div class="password-strength mt-2" role="progressbar" aria-label="Надёжность пароля" :aria-valuenow="passwordStrength.percent" aria-valuemin="0" aria-valuemax="100">
                  <div class="strength-bar" :style="{width: passwordStrength.percent + '%'}" :class="strengthClass"></div>
                </div>
                <small :class="strengthTextClass">{{ strengthText }}</small>
              </div>
            </div>
            <div class="mb-4">
              <label for="registerConfirm" class="form-label">Подтвердите пароль</label>
              <div class="input-group">
                <input :type="showConfirm ? 'text' : 'password'" class="form-control" id="registerConfirm" v-model="confirmPassword" placeholder="Повторите пароль" autocomplete="new-password" aria-required="true" required>
                <button class="btn btn-outline-secondary" type="button" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Скрыть пароль' : 'Показать пароль'">
                  <svg class="icon icon-lg" aria-hidden="true"><use :href="showConfirm ? '#icon-eye-slash' : '#icon-eye'"></use></svg>
                </button>
                <div class="invalid-feedback" :class="{ 'd-block': submitted && confirmPassword !== password }">Пароли не совпадают</div>
              </div>
            </div>
            <div class="form-check mb-4">
              <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="agreed" aria-required="true" required>
              <label class="form-check-label small" for="agreeTerms">
                Я согласен с <a href="#" class="text-primary">условиями использования</a>
                и <a href="#" class="text-primary">политикой конфиденциальности</a>
              </label>
              <div class="invalid-feedback d-block" v-if="submitted && !agreed">
                Необходимо принять условия использования
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-100 py-2" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <svg v-else class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-user-plus"></use></svg>
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
            <div v-if="error" class="alert alert-danger mt-3 py-2 small" role="alert">{{ error }}</div>
          </form>
          <div class="text-center mt-4">
            <span class="text-muted small">Уже есть аккаунт?</span>
            <button class="btn btn-link text-decoration-none p-0 ms-1" @click="$emit('switch-to-login')" aria-label="Перейти ко входу">Войти</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const { register } = useAuth()
const { showToast } = useToast()

const visible = defineModel({ type: Boolean, default: false })
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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const agreed = ref(false)
const loading = ref(false)
const error = ref('')
const submitted = ref(false)

const passwordStrength = computed(() => {
  let score = 0
  const p = password.value
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[a-z]/.test(p)) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^a-zA-Z0-9]/.test(p)) score++
  return { score, percent: Math.min(100, score * 16.67) }
})

const strengthClass = computed(() => {
  if (passwordStrength.value.percent < 30) return 'bg-danger'
  if (passwordStrength.value.percent < 70) return 'bg-warning'
  return 'bg-success'
})

const strengthText = computed(() => {
  if (passwordStrength.value.percent < 30) return 'Слабый пароль'
  if (passwordStrength.value.percent < 70) return 'Средний пароль'
  return 'Надёжный пароль'
})

const strengthTextClass = computed(() => {
  if (passwordStrength.value.percent < 30) return 'text-danger'
  if (passwordStrength.value.percent < 70) return 'text-warning'
  return 'text-success'
})

async function handleRegister() {
  submitted.value = true
  error.value = ''
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  if (!agreed.value) {
    error.value = 'Необходимо принять условия использования'
    return
  }
  loading.value = true
  try {
    await register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })
    showToast('Регистрация успешна!', 'success')
    visible.value = false
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    agreed.value = false
    submitted.value = false
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>
