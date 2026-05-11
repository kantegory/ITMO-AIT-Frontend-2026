<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/composables/useAuth'
import { useBodyClass } from '@/composables/useBodyClass'

useBodyClass('d-flex align-items-center justify-content-center py-4 bg-body-tertiary vh-100', '#f4f6f9')

const router = useRouter()
const { setUser } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

async function submit() {
  try {
    const user = await loginUser(form.email, form.password)

    if (user) {
      setUser(user)
      alert(`Добро пожаловать, ${user.name}!`)
      router.push({ name: 'dashboard' })
    } else {
      alert('Неверный email или пароль!')
    }
  } catch (error) {
    console.error('Ошибка входа:', error)
    alert('Ошибка подключения к серверу.')
  }
}
</script>

<template>
  <main class="form-signin w-100 m-auto" style="max-width: 400px;">
    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body p-4">
        <h2 class="text-center mb-2 text-custom">
          <img style="transform: translateY(-4px);" src="/imgs/1.png" alt="Логотип MFF" width="35" />
          <span class="fs-3 fw-bolder">MFF</span>
          <img style="transform: translateY(-4px);" src="/imgs/2.png" alt="" width="35" />
        </h2>

        <h3 class="text-center mb-3 text-custom">Finance assistance</h3>

        <h4 class="text-center mb-3">Вход в систему</h4>

        <form id="loginForm" action="dash.html" @submit.prevent="submit">
          <div class="form-floating mb-3">
            <input
              id="floatingEmail"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="name@example.com"
              required
              aria-required="true"
            />

            <label for="floatingEmail">Email адрес</label>
          </div>

          <div class="form-floating mb-3">
            <input
              id="floatingPassword"
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
              aria-required="true"
            />

            <label for="floatingPassword">Пароль</label>
          </div>

          <button type="submit" class="btn btn-custom w-100 py-2 mb-3">Войти</button>

          <div class="text-center text-custom">
            <span class="text-muted">Нет аккаунта?</span>

            <a
              href="reg.html"
              class="text-decoration-none text-custom fw-bold"
              @click.prevent="router.push({ name: 'register' })"
            >
              Зарегистрироваться
            </a>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
