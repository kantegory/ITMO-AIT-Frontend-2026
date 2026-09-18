<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    alert("Пароли не совпадают!")
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/register', {
      email: email.value,
      password: password.value,
      name: name.value
    })

    if (response.status === 201 || response.status === 200) {
      alert("Регистрация прошла успешно!")
      router.push('/login')
    }
  } catch (error) {
    alert("Ошибка: " + (error.response?.data || error.message))
  }
}
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <section class="card shadow p-4" style="width: 450px; border-radius: 15px;" aria-labelledby="register-heading">
      <header class="text-center mb-6">
        <div class="d-flex justify-content-center align-items-center mb-2">
          <img src="/img/logo.png" alt="Логотип Финанас" width="45" class="me-2">
          <h1 id="register-heading" class="text-success fw-bold h2">Регистрация</h1>
        </div>
        <p class="text-muted">Присоединяйся к "Финанас"</p>
      </header>

      <form @submit.prevent="handleRegister" aria-label="Форма регистрации">
        <div class="mb-3">
          <label for="nameInput" class="form-label">Как к Вам обращаться?</label>
          <input type="text" class="form-control" id="nameInput" placeholder="Ваше имя или никнейм" required aria-required="true" v-model="name">
        </div>

        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input type="email" class="form-control" id="emailInput" placeholder="name@example.com" required aria-required="true" v-model="email">
        </div>

        <div class="mb-3">
          <label for="passwordInput" class="form-label">Придумайте пароль</label>
          <input type="password" class="form-control" id="passwordInput" required aria-required="true" aria-describedby="passwordHelp" v-model="password">
          <div id="passwordHelp" class="form-text">Пароль должен содержать не менее 8 символов.</div>
        </div>

        <div class="mb-4">
          <label for="passwordConfirm" class="form-label">Повторите пароль</label>
          <input type="password" class="form-control" id="passwordConfirm" required aria-required="true" v-model="passwordConfirm">
        </div>

        <button type="submit" class="btn btn-success w-100 mb-3" aria-label="Создать новый аккаунт">Создать аккаунт</button>

        <div class="text-center">
          <span>Уже есть аккаунт?</span>
          <RouterLink to="/login" class="text-success text-decoration-none" aria-label="Перейти на страницу входа">Войти</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>
