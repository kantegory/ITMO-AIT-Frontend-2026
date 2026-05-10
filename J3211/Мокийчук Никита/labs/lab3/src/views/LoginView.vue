<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import PasswordInput from '../components/PasswordInput.vue'

const router = useRouter()
const { login } = useAuth()
const { showToast } = useToast()

const email = ref('')
const password = ref('')
const remember = ref(false)
const resetEmail = ref('')

const handleSubmit = async () => {
  if (!email.value.trim() || !password.value.trim()) {
    showToast('Заполните все поля', 'danger')
    return
  }
  try {
    const user = await login(email.value, password.value)
    showToast('Вход выполнен успешно!', 'success')
    setTimeout(
      () => router.push({ name: user.role === 'teacher' ? 'teacher' : 'profile' }),
      600
    )
  } catch (err) {
    showToast(err.message, 'danger')
  }
}

const handleReset = () => {
  if (!resetEmail.value.trim()) {
    showToast('Введите email', 'danger')
    return
  }
  showToast(`Письмо отправлено на ${resetEmail.value}`, 'success')
  resetEmail.value = ''
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card" role="region" aria-labelledby="login-heading">
      <div class="text-center mb-2">
        <router-link :to="{ name: 'home' }" class="text-decoration-none auth-logo">
          <svg class="svg-icon" aria-hidden="true">
            <use href="/sprite/sprite.svg#icon-mortarboard"></use>
          </svg>
          MokiichukKnowledge
        </router-link>
      </div>

      <h1 class="h2 text-center" id="login-heading">Вход в аккаунт</h1>
      <p class="text-center">Рады видеть вас снова!</p>

      <form novalidate aria-label="Форма входа" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label" for="loginEmail">
            Email <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <input
            type="email"
            class="form-control"
            id="loginEmail"
            placeholder="example@mail.ru"
            autocomplete="email"
            required
            v-model="email"
          />
        </div>

        <div class="mb-3">
          <label class="form-label" for="loginPassword">
            Пароль <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <PasswordInput
            id="loginPassword"
            placeholder="Введите пароль"
            autocomplete="current-password"
            required
            v-model="password"
          />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="rememberMe"
              v-model="remember"
            />
            <label class="form-check-label text-sm-2" for="rememberMe">Запомнить меня</label>
          </div>
          <a
            href="#"
            class="text-decoration-none auth-link"
            data-bs-toggle="modal"
            data-bs-target="#resetModal"
          >Забыли пароль?</a>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2">Войти</button>
      </form>

      <p class="text-center mt-4 mb-0 text-sm-2">
        Нет аккаунта?
        <router-link :to="{ name: 'register' }" class="fw-bold text-decoration-none">
          Зарегистрируйтесь
        </router-link>
      </p>
    </div>
  </div>

  <div class="modal fade" id="resetModal" tabindex="-1" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title h5">Сброс пароля</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-3">Введите email, и мы отправим вам ссылку для восстановления.</p>
          <input
            type="email"
            class="form-control"
            placeholder="Ваш email"
            autocomplete="email"
            v-model="resetEmail"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleReset">
            Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
