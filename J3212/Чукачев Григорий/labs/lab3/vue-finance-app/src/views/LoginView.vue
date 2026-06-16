<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value
    })

    if (response.status === 200) {
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('userName', response.data.user.name)
      alert("Успешный вход!")
      router.push('/dashboard')
    }
  } catch (error) {
    alert("Неверный email или пароль!")
  }
}
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <section class="card shadow p-4" style="width: 400px; border-radius: 15px;" aria-labelledby="login-heading">
      <header class="text-center mb-6">
        <div class="d-flex justify-content-center align-items-center mb-2">
          <img src="/img/logo.png" alt="Логотип Финанас" width="45" class="me-2">
          <h1 id="login-heading" class="text-success fw-bold mb-0 h2">Финанас</h1>
        </div>
        <p class="text-muted">Управляй бюджетом со вкусом</p>
      </header>

      <form @submit.prevent="handleLogin" aria-label="Форма входа">
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input type="email" class="form-control" id="emailInput" placeholder="name@example.com" required aria-required="true" v-model="email">
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Пароль</label>
          <input type="password" class="form-control" id="passwordInput" placeholder="Введите пароль" required aria-required="true" v-model="password">
        </div>

        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="rememberCheck">
          <label class="form-check-label" for="rememberCheck">Запомнить меня</label>
        </div>
        <button type="submit" class="btn btn-success w-100 mb-3" aria-label="Войти в систему">Войти</button>

        <div class="text-center">
          <span>Нет аккаунта?</span>
          <RouterLink to="/register" class="text-success text-decoration-none" aria-label="Перейти к регистрации">Зарегистрироваться</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>
