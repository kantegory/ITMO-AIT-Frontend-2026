<template>
  <div class="auth-wrapper">
    <main class="auth-card" style="position:relative; padding-top:3rem;">
      <h1 class="visually-hidden">Регистрация нового пользователя</h1>

      <router-link
        to="/"
        class="btn-close btn-close-white"
        style="position:absolute; top:0.75rem; right:0.75rem;"
        aria-label="Закрыть и вернуться на главную"
      />

      <div class="tab-buttons">
        <router-link to="/sign-in">
          <button type="button">Вход</button>
        </router-link>
        <button class="active" type="button">Регистрация</button>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">
        {{ error }}
      </div>
      <div v-if="success" class="alert alert-success" role="alert" aria-live="polite">
        {{ success }}
      </div>

      <form novalidate @submit.prevent="onSubmit">
        <div class="form-floating mb-3">
          <input
            v-model="form.name"
            type="text"
            class="form-control auth-input"
            id="registerName"
            placeholder="Имя"
            required
            autocomplete="name"
          />
          <label for="registerName">Имя</label>
          <div class="invalid-feedback">Введите имя</div>
        </div>

        <div class="form-floating mb-3">
          <input
            v-model="form.email"
            type="email"
            class="form-control auth-input"
            id="registerEmail"
            placeholder="name@example.com"
            required
            autocomplete="email"
          />
          <label for="registerEmail">E-mail</label>
          <div class="invalid-feedback">Введите корректный email</div>
        </div>

        <div class="form-floating mb-3">
          <input
            v-model="form.password"
            type="password"
            class="form-control auth-input"
            id="registerPassword"
            placeholder="Пароль"
            required
            minlength="4"
            autocomplete="new-password"
          />
          <label for="registerPassword">Пароль</label>
          <div class="invalid-feedback">Пароль должен быть не менее 4 символов</div>
        </div>

        <div class="mb-3">
          <label class="form-label" style="color: var(--auth-text)">Я регистрируюсь как</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input v-model="form.role" class="form-check-input" type="radio" name="role"
                     id="roleStudent" value="student"/>
              <label class="form-check-label" for="roleStudent">Студент</label>
            </div>
            <div class="form-check">
              <input v-model="form.role" class="form-check-input" type="radio" name="role"
                     id="roleTeacher" value="teacher"/>
              <label class="form-check-label" for="roleTeacher">Преподаватель</label>
            </div>
          </div>
        </div>

        <button class="btn btn-primary w-100 py-2 mb-3 auth-btn" type="submit"
                :disabled="isLoading">
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
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
const form = reactive({name: '', email: '', password: '', role: 'student'})
const error = ref('')
const success = ref('')
const isLoading = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  isLoading.value = true
  try {
    const user = await auth.register(form)
    success.value = 'Регистрация успешна! Перенаправление...'
    setTimeout(() => {
      router.push(user.role === 'teacher' ? '/teacher' : '/')
    }, 1000)
  } catch (err) {
    error.value = err.response?.status === 400
      ? 'Пользователь с таким email уже существует'
      : 'Ошибка регистрации. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>
