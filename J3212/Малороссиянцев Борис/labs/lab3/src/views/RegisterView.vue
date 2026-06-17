<template>
  <div class="auth-outer">
    <div class="auth-card">
      <RouterLink to="/" class="auth-logo">Wanderlust</RouterLink>
      <p class="auth-sub">Создайте аккаунт бесплатно</p>

      <form @submit.prevent="handleRegister">
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label for="firstName" class="form-label">Имя <span style="color:#dc2626">*</span></label>
            <input id="firstName" v-model="firstName" type="text" class="form-control"
              placeholder="Имя" required autocomplete="given-name" />
          </div>
          <div class="col-6">
            <label for="lastName" class="form-label">Фамилия</label>
            <input id="lastName" v-model="lastName" type="text" class="form-control"
              placeholder="Фамилия" autocomplete="family-name" />
          </div>
        </div>

        <div class="mb-3">
          <label for="regEmail" class="form-label">Email <span style="color:#dc2626">*</span></label>
          <input id="regEmail" v-model="email" type="email" class="form-control"
            placeholder="your@email.com" required autocomplete="email" />
        </div>

        <div class="mb-2">
          <label for="regPassword" class="form-label">Пароль <span style="color:#dc2626">*</span></label>
          <div class="input-group">
            <input id="regPassword" v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="form-control" placeholder="Минимум 8 символов"
              required autocomplete="new-password"
              @input="calcStrength" />
            <button type="button" class="btn btn-outline-secondary"
              :aria-label="showPass ? 'Скрыть пароль' : 'Показать пароль'"
              @click="showPass = !showPass">
              <i :class="`bi bi-eye${showPass ? '-slash' : ''}`"></i>
            </button>
          </div>
        </div>

        <!-- Индикатор силы пароля -->
        <div class="mb-3">
          <div class="progress" style="height:4px;border-radius:4px;background:#e5e7eb;">
            <div class="progress-bar" role="progressbar"
              :style="{ width: strengthWidth, background: strengthColor }"
              :aria-valuenow="strengthScore" aria-valuemin="0" aria-valuemax="4">
            </div>
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:.3rem;">
            {{ strengthLabel }}
          </div>
        </div>

        <button type="submit" class="btn-primary-custom w-100" :disabled="loading"
          style="justify-content:center;">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ loading ? 'Создание...' : 'Создать аккаунт' }}
        </button>
      </form>

      <p class="text-center mt-3" style="font-size:.875rem;color:var(--text-muted);">
        Уже есть аккаунт?
        <RouterLink to="/login" style="color:var(--accent);">Войти</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router          = useRouter()
const { register }    = useApi()
const { saveSession } = useAuth()
const { showToast }   = useToast()

const firstName    = ref('')
const lastName     = ref('')
const email        = ref('')
const password     = ref('')
const showPass     = ref(false)
const loading      = ref(false)
const strengthScore = ref(0)

const LEVELS = [
  { w:'0%',   c:'transparent', t:''         },
  { w:'25%',  c:'#ef4444',     t:'Слабый'   },
  { w:'50%',  c:'#f97316',     t:'Средний'  },
  { w:'75%',  c:'#eab308',     t:'Хороший'  },
  { w:'100%', c:'#22c55e',     t:'Отличный' },
]
const strengthWidth = computed(() => LEVELS[strengthScore.value].w)
const strengthColor = computed(() => LEVELS[strengthScore.value].c)
const strengthLabel = computed(() => LEVELS[strengthScore.value].t)

function calcStrength() {
  const v = password.value
  let s = 0
  if (v.length >= 8)         s++
  if (/[A-Z]/.test(v))       s++
  if (/[0-9]/.test(v))       s++
  if (/[^A-Za-z0-9]/.test(v)) s++
  strengthScore.value = s
}

async function handleRegister() {
  if (!firstName.value || !email.value || !password.value) {
    showToast('Заполните все обязательные поля', 'error'); return
  }
  if (password.value.length < 8) {
    showToast('Пароль — минимум 8 символов', 'error'); return
  }
  loading.value = true
  try {
    const { token, user } = await register({
      firstName: firstName.value.trim(),
      lastName:  lastName.value.trim(),
      email:     email.value.trim(),
      password:  password.value,
    })
    saveSession(token, user)
    showToast(`Аккаунт создан! Добро пожаловать, ${user.firstName}!`)
    router.replace('/dashboard')
  } catch (err) {
    showToast(err.response?.data?.error || 'Ошибка регистрации', 'error')
  } finally {
    loading.value = false
  }
}
</script>
