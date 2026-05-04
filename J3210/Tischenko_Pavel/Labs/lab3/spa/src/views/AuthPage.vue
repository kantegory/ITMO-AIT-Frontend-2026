<template>
  <base-layout>
    <section class="mx-auto" style="max-width: 520px">
      <h1 class="h4 mb-3">Авторизация</h1>

      <div class="btn-group btn-group-sm mb-3" role="group" aria-label="Режим формы">
        <button
          type="button"
          class="btn"
          :class="mode === 'login' ? 'btn-primary' : 'btn-outline-primary'"
          @click="mode = 'login'"
        >
          Вход
        </button>
        <button
          type="button"
          class="btn"
          :class="mode === 'register' ? 'btn-primary' : 'btn-outline-primary'"
          @click="mode = 'register'"
        >
          Регистрация
        </button>
      </div>

      <form class="card shadow-sm" @submit.prevent="submit">
        <div class="card-body">
          <div v-if="mode === 'register'" class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label" for="firstName">Имя</label>
              <input id="firstName" v-model.trim="form.firstName" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="lastName">Фамилия</label>
              <input id="lastName" v-model.trim="form.lastName" class="form-control" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input id="email" v-model.trim="form.email" type="email" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label" for="password">Пароль</label>
            <input id="password" v-model="form.password" type="password" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label" for="role">Роль</label>
            <select id="role" v-model="form.role" class="form-select" required>
              <option value="student">Студент</option>
              <option value="trainer">Тренер</option>
            </select>
          </div>

          <button type="button" class="btn btn-link p-0 mb-3 small" @click="showForgot = true">
            Забыли пароль?
          </button>
          <div v-if="showForgot" class="alert alert-info py-2">
            Если аккаунт существует, ссылка для восстановления отправлена на email.
          </div>

          <div v-if="authStore.error" class="alert alert-danger py-2">{{ authStore.error }}</div>

          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </div>
      </form>
    </section>
  </base-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mode = ref('login')
const showForgot = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student'
})

async function submit() {
  try {
    if (mode.value === 'login') {
      await authStore.login({
        email: form.email,
        password: form.password,
        role: form.role
      })
    } else {
      await authStore.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role
      })
    }

    router.push({ name: authStore.role === 'trainer' ? 'teacher' : 'student' })
  } catch {
    return
  }
}
</script>
