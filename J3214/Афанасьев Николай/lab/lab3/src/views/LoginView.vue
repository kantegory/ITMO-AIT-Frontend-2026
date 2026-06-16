<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { get } = useApi()
const { setSession } = useAuth()

const email    = ref('')
const password = ref('')
const showPass = ref(false)
const loading  = ref(false)
const error    = ref('')

async function submit() {
  error.value = ''
  if (!email.value || !password.value) { error.value = 'Заполните все поля'; return }

  loading.value = true
  try {
    const users = await get('/users', { email: email.value })
    const user  = users.find(u => u.password === password.value)
    if (!user) { error.value = 'Неверный email или пароль'; return }

    const s = setSession(user)
    router.push({ name: s.role === 'teacher' ? 'teacher' : 'dashboard' })
  } catch {
    error.value = 'Не удалось подключиться к серверу. Убедитесь, что json-server запущен (npm run api).'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Логотип -->
      <div class="d-flex align-items-center gap-2 mb-4">
        <svg width="40" height="40" viewBox="0 0 56 56">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7F77DD"/>
              <stop offset="100%" stop-color="#3C3489"/>
            </linearGradient>
          </defs>
          <rect width="56" height="56" rx="14" fill="url(#g1)"/>
          <text x="9" y="38" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="white" letter-spacing="1">LF</text>
        </svg>
        <div>
          <div style="font-size:18px;font-weight:500;">LearnFlow</div>
          <div style="font-size:12px;color:#888;">Платформа онлайн-курсов</div>
        </div>
      </div>

      <h1 style="font-size:22px;font-weight:500;margin-bottom:4px;">Добро пожаловать</h1>
      <p style="font-size:13px;color:#888;margin-bottom:1.5rem;">Войдите в аккаунт, чтобы продолжить обучение</p>

      <button class="btn-social mb-2" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Войти через Google
      </button>

      <div class="divider"><hr><span>или через email</span><hr></div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label style="font-size:13px;font-weight:500;">Email</label>
          <input v-model="email" type="email" class="form-control-custom" placeholder="you@example.com" required>
        </div>

        <div class="mb-1">
          <label style="font-size:13px;font-weight:500;">Пароль</label>
          <div class="password-wrapper">
            <input v-model="password" :type="showPass ? 'text' : 'password'" class="form-control-custom"
              placeholder="Введите пароль" style="padding-right:40px;" required>
            <button class="toggle-pass" type="button" @click="showPass = !showPass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-between mb-3">
          <span></span>
          <a href="#" style="font-size:12px;color:#888;">Забыли пароль?</a>
        </div>

        <div v-if="error" style="color:#E24B4A;font-size:13px;margin-bottom:12px;">{{ error }}</div>

        <button type="submit" class="btn-main mb-3" :disabled="loading">
          {{ loading ? 'Входим…' : 'Войти' }}
        </button>
      </form>

      <p style="text-align:center;font-size:13px;color:#888;margin:0;">
        Нет аккаунта?
        <router-link to="/register" class="link-purple">Зарегистрироваться</router-link>
      </p>

      <div style="margin-top:1.5rem;padding:10px 14px;background:#f8f7fd;border-radius:12px;font-size:12px;color:#888;line-height:1.6;">
        <strong style="color:#534AB7;">Демо-данные:</strong><br>
        Студент: <code>ivan@example.com</code> / <code>password123</code><br>
        Преподаватель: <code>teacher@example.com</code> / <code>teacher123</code>
      </div>
    </div>
  </div>
</template>
