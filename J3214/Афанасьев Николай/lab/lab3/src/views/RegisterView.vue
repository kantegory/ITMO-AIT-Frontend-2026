<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { get, post } = useApi()
const { setSession } = useAuth()

const firstName  = ref('')
const lastName   = ref('')
const email      = ref('')
const password   = ref('')
const agree      = ref(false)
const showPass   = ref(false)
const selectedRole = ref('student')
const strength   = ref({ width: '0', color: '#ff4d4d', label: '' })
const loading    = ref(false)
const error      = ref('')

function calcStrength(val) {
  if (!val) { strength.value = { width: '0', color: '#ff4d4d', label: '' }; return }
  let score = 0
  if (val.length > 5) score++
  if (val.length > 8) score++
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++
  const idx = Math.max(0, score - 1)
  strength.value = {
    width:  ['33%', '66%', '100%'][idx],
    color:  ['#ff4d4d', '#ffd11a', '#2ecc71'][idx],
    label:  ['Слабый', 'Средний', 'Надежный'][idx],
  }
}

async function submit() {
  error.value = ''
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    error.value = 'Пожалуйста, заполните все поля'; return
  }
  if (!agree.value) { error.value = 'Необходимо согласиться с условиями'; return }

  loading.value = true
  try {
    const existing = await get('/users', { email: email.value })
    if (existing.length > 0) { error.value = 'Пользователь с таким email уже существует'; return }

    const user = await post('/users', {
      firstName: firstName.value,
      lastName:  lastName.value,
      email:     email.value,
      password:  password.value,
      role:      selectedRole.value,
      about:     '',
    })
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
    <div class="auth-card register-card">
      <div class="d-flex align-items-center gap-2 mb-4">
        <svg width="40" height="40" viewBox="0 0 56 56">
          <defs>
            <linearGradient id="g1r" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7F77DD"/>
              <stop offset="100%" stop-color="#3C3489"/>
            </linearGradient>
          </defs>
          <rect width="56" height="56" rx="14" fill="url(#g1r)"/>
          <text x="9" y="38" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="white" letter-spacing="1">LF</text>
        </svg>
        <div>
          <div style="font-size:18px;font-weight:500;">LearnFlow</div>
          <div style="font-size:12px;color:#888;">Платформа онлайн-курсов</div>
        </div>
      </div>

      <h1 style="font-size:22px;font-weight:500;margin-bottom:4px;">Создать аккаунт</h1>
      <p style="font-size:13px;color:#888;margin-bottom:1.5rem;">Присоединяйтесь к LearnFlow</p>

      <form @submit.prevent="submit">
        <!-- Роль -->
        <div class="d-flex gap-2 mb-3">
          <div class="role-card" :class="{ active: selectedRole === 'student' }" @click="selectedRole = 'student'">
            <div class="role-icon">🎓</div>
            <div class="role-title">Студент</div>
            <div class="role-desc">Изучайте курсы</div>
          </div>
          <div class="role-card" :class="{ active: selectedRole === 'teacher' }" @click="selectedRole = 'teacher'">
            <div class="role-icon">👨‍🏫</div>
            <div class="role-title">Преподаватель</div>
            <div class="role-desc">Создавайте курсы</div>
          </div>
        </div>

        <!-- Имя / фамилия -->
        <div class="d-flex gap-2">
          <div class="flex-1">
            <label style="font-size:13px;font-weight:500;">Имя</label>
            <input v-model="firstName" type="text" class="form-control-custom" placeholder="Иван" required>
          </div>
          <div class="flex-1">
            <label style="font-size:13px;font-weight:500;">Фамилия</label>
            <input v-model="lastName" type="text" class="form-control-custom" placeholder="Иванов" required>
          </div>
        </div>

        <div>
          <label style="font-size:13px;font-weight:500;">Email</label>
          <input v-model="email" type="email" class="form-control-custom" placeholder="you@example.com" required>
        </div>

        <div>
          <label style="font-size:13px;font-weight:500;">Пароль</label>
          <div class="password-wrapper">
            <input v-model="password" :type="showPass ? 'text' : 'password'" id="passInput"
              class="form-control-custom" placeholder="Введите пароль" style="padding-right:40px;"
              @input="calcStrength(password)" required>
            <button class="toggle-pass" type="button" @click="showPass = !showPass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <div v-if="password" class="strength-bar">
            <div class="strength-fill" :style="{ width: strength.width, background: strength.color }"></div>
          </div>
          <div class="strength-label">{{ strength.label }}</div>
        </div>

        <div class="d-flex align-items-center gap-2 mb-3" style="margin-top:8px;">
          <input type="checkbox" id="agreeCheck" v-model="agree">
          <label for="agreeCheck" style="font-size:13px;color:#888;">
            Согласен с <a href="#" class="link-purple">условиями использования</a>
          </label>
        </div>

        <div v-if="error" style="color:#E24B4A;font-size:13px;margin-bottom:12px;">{{ error }}</div>

        <button type="submit" class="btn-main mb-3" :disabled="loading">
          {{ loading ? 'Создаём аккаунт…' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p style="text-align:center;font-size:13px;color:#888;margin:0;">
        Уже есть аккаунт?
        <router-link to="/login" class="link-purple">Войти</router-link>
      </p>
    </div>
  </div>
</template>
