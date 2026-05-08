<template>
  <div class="auth-wrapper">
    <main class="auth-card" style="position:relative; padding-top:3rem;">
      <h1 class="visually-hidden">Вход в систему</h1>

      <router-link
        to="/"
        class="btn-close btn-close-white"
        style="position:absolute; top:0.75rem; right:0.75rem;"
        aria-label="Закрыть и вернуться на главную"
      />

      <div class="tab-buttons">
        <button class="active" type="button">Вход</button>
        <router-link to="/register">
          <button type="button">Регистрация</button>
        </router-link>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">
        {{ error }}
      </div>

      <form novalidate @submit.prevent="onSubmit">
        <div class="form-floating mb-3">
          <input
            v-model="form.email"
            type="email"
            class="form-control auth-input"
            id="loginEmail"
            placeholder="name@example.com"
            required
            autocomplete="email"
          />
          <label for="loginEmail">E-mail</label>
          <div class="invalid-feedback">Введите корректный email</div>
        </div>

        <div class="form-floating mb-3">
          <input
            v-model="form.password"
            type="password"
            class="form-control auth-input"
            id="loginPassword"
            placeholder="Пароль"
            required
            autocomplete="current-password"
          />
          <label for="loginPassword">Пароль</label>
          <div class="invalid-feedback">Пароль не может быть пустым</div>
        </div>

        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="loginRemember"/>
          <label class="form-check-label" for="loginRemember">Запомнить меня</label>
        </div>

        <button class="btn btn-primary w-100 py-2 mb-3 auth-btn" type="submit"
                :disabled="isLoading">
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({email: '', password: ''})
const error = ref('')
const isLoading = ref(false)

async function onSubmit() {
  error.value = ''
  isLoading.value = true
  try {
    const user = await auth.login(form)
    router.push(user.role === 'teacher' ? '/teacher' : '/')
  } catch {
    error.value = 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}
</script>
