<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { checkEmailExists, registerUser } from '@/api/auth'
import { useBodyClass } from '@/composables/useBodyClass'

useBodyClass('d-flex align-items-center justify-content-center py-4 bg-body-tertiary vh-100', '#f4f6f9')

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

async function submit() {
  if (form.password !== form.confirmPassword) {
    alert('Пароли не совпадают!')
    return
  }

  if (form.password.length < 8) {
    alert('Пароль должен содержать 8 символов, хотя бы одну букву и цифру')
    return
  }

  const hasLetter = /[a-zA-Zа-яА-Я]/.test(form.password)
  const hasNumber = /[0-9]/.test(form.password)

  if (!hasLetter || !hasNumber) {
    alert('Ошибка: Пароль должен содержать как минимум одну букву и одну цифру!')
    return
  }

  try {
    const exists = await checkEmailExists(form.email)

    if (exists) {
      alert('Пользователь с таким email уже существует!')
      return
    }

    await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    })

    alert('Регистрация успешна! Теперь войдите в систему.')
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Ошибка регистрации:', error)
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

        <h4 class="text-center mb-3">Регистрация аккаунта</h4>

        <form id="regForm" action="dash.html" @submit.prevent="submit">
          <div class="form-floating mb-3">
            <input
              id="floatingName"
              v-model="form.name"
              type="text"
              class="form-control"
              placeholder="Иван Иванов"
              required
            />

            <label for="floatingName">Ваше имя</label>
          </div>

          <div class="form-floating mb-3">
            <input
              id="floatingEmail"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="name@example.com"
              required
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

          <div class="form-floating mb-3">
            <input
              id="floatingPasswordConfirm"
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              placeholder="Password Confirm"
              required
              aria-required="true"
            />

            <label for="floatingPasswordConfirm">Повторите пароль</label>
          </div>

          <button class="btn btn-custom w-100 py-2 mb-3" type="submit">Создать аккаунт</button>

          <div class="text-center text-custom">
            <span class="text-muted">Уже есть аккаунт?</span>

            <a
              href="login.html"
              class="text-decoration-none text-custom fw-bold"
              @click.prevent="router.push({ name: 'login' })"
            >
              Войти
            </a>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
