<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppAlert from '../components/AppAlert.vue'
import { useApi } from '../composables/useApi'
import { useSession } from '../composables/useSession'

const route = useRoute()
const router = useRouter()
const { post } = useApi()
const { saveSession } = useSession()

const form = reactive({
  login: '',
  password: '',
  remember: true
})

const loading = ref(false)
const message = ref('')
const messageType = ref('info')

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

function resolveReturnTo() {
  const returnTo = String(route.query.returnTo || '')

  if (!returnTo.startsWith('/')) return { name: 'search' }
  if (returnTo.startsWith('//')) return { name: 'search' }

  return returnTo
}

async function submit() {
  setMessage('')

  if (!form.login.trim() || !form.password.trim()) {
    setMessage('Введите логин/email и пароль', 'warning')
    return
  }

  loading.value = true

  try {
    const result = await post('/login', {
      login: form.login.trim(),
      password: form.password.trim()
    })

    saveSession(result.token, result.user, form.remember)
    setMessage('Вход выполнен. Перенаправляем...', 'success')

    setTimeout(() => {
      router.push(resolveReturnTo())
    }, 400)
  } catch (error) {
    setMessage(error.message || 'Не удалось выполнить вход', 'danger')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-6">
      <section class="hub-card p-4 p-md-5">
        <h1 class="section-title mb-2">Вход</h1>
        <p class="muted mb-4">Будь частью сообщества AI Model &amp; Dataset Hub</p>

        <form class="row g-3" @submit.prevent="submit">
          <div class="col-12">
            <label for="login" class="form-label">Email или логин</label>
            <input id="login" v-model="form.login" type="text" class="form-control" autocomplete="username" required>
          </div>

          <div class="col-12">
            <label for="password" class="form-label">Пароль</label>
            <input id="password" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required>
          </div>

          <div class="col-12 form-check">
            <input id="remember" v-model="form.remember" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="remember">Запомнить меня</label>
          </div>

          <div class="col-12 d-grid">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              {{ loading ? 'Выполняем вход...' : 'Войти' }}
            </button>
          </div>

          <div class="col-12">
            <AppAlert :type="messageType" :message="message" />
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
