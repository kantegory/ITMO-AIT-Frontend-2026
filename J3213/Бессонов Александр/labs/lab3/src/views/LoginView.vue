<script setup>
import { ArrowRight, Eye, EyeOff, Info, LockKeyhole, Mail } from '@lucide/vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('alexander@example.ru')
const password = ref('pulse123')
const remember = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

function getErrorMessage(error) {
  const response = error.response?.data
  if (typeof response === 'string') return response
  return response?.message || error.message || 'Не удалось войти. Проверьте почту и пароль.'
}

async function submit() {
  errorMessage.value = ''
  try {
    await auth.login(email.value, password.value, remember.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.replace(redirect)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
}
</script>

<template>
  <AuthLayout
    showcase-eyebrow="Командная работа без хаоса"
    :showcase-lines="['Держите проекты', 'в одном ритме']"
    showcase-text="Задачи, сроки и обсуждения собраны в понятном рабочем пространстве."
  >
    <div class="auth-heading">
      <p class="auth-eyebrow auth-eyebrow-dark">С возвращением</p>
      <h2 id="loginTitle">Войдите в аккаунт</h2>
      <p>Продолжите работу над проектами вместе с командой.</p>
    </div>

    <form class="auth-form" aria-labelledby="loginTitle" @submit.prevent="submit">
      <label for="loginEmail">Электронная почта</label>
      <div class="auth-input">
        <Mail :size="20" />
        <input id="loginEmail" v-model.trim="email" type="email" autocomplete="email" required />
      </div>

      <div class="auth-label-row">
        <label for="loginPassword">Пароль</label>
        <button type="button" class="auth-text-button">Забыли пароль?</button>
      </div>
      <div class="auth-input">
        <LockKeyhole :size="20" />
        <input
          id="loginPassword"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          minlength="6"
          autocomplete="current-password"
          required
        />
        <button type="button" class="password-toggle" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
          <EyeOff v-if="showPassword" :size="20" /><Eye v-else :size="20" />
        </button>
      </div>

      <label class="auth-checkbox"><input v-model="remember" type="checkbox" /><span>Оставаться в системе</span></label>

      <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>

      <button class="auth-submit" type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Входим…' : 'Войти' }}<ArrowRight :size="20" />
      </button>
    </form>

    <p class="auth-switch">Нет аккаунта? <RouterLink to="/register">Создать бесплатно</RouterLink></p>
    <p class="demo-note"><Info :size="15" /> Демо: alexander@example.ru / pulse123</p>
  </AuthLayout>
</template>
