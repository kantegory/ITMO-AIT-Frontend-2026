<template>
  <div class="auth-outer">
    <div class="auth-card">
      <RouterLink to="/" class="auth-logo">Wanderlust</RouterLink>
      <p class="auth-sub">Войдите, чтобы продолжить</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input
            id="loginEmail" v-model="email" type="email"
            class="form-control" placeholder="your@email.com" required autocomplete="email" />
        </div>

        <div class="mb-3">
          <label for="loginPassword" class="form-label">Пароль</label>
          <div class="input-group">
            <input
              id="loginPassword" v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="form-control" placeholder="Введите пароль" required autocomplete="current-password" />
            <button type="button" class="btn btn-outline-secondary password-toggle"
              :aria-label="showPass ? 'Скрыть пароль' : 'Показать пароль'"
              @click="showPass = !showPass">
              <i :class="`bi bi-eye${showPass ? '-slash' : ''}`"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-primary-custom w-100" :disabled="loading" style="justify-content:center;">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <p class="text-center mt-3" style="font-size:.875rem;color:var(--text-muted);">
        Нет аккаунта?
        <RouterLink to="/register" style="color:var(--accent);">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router   = useRouter()
const { login }         = useApi()
const { saveSession }   = useAuth()
const { showToast }     = useToast()

const email    = ref('')
const password = ref('')
const showPass = ref(false)
const loading  = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    showToast('Заполните email и пароль', 'error'); return
  }
  loading.value = true
  try {
    const { token, user } = await login(email.value.trim(), password.value)
    saveSession(token, user)
    showToast(`Добро пожаловать, ${user.firstName}!`)
    router.replace('/dashboard')
  } catch (err) {
    showToast(err.response?.data?.error || 'Неверный email или пароль', 'error')
  } finally {
    loading.value = false
  }
}
</script>
