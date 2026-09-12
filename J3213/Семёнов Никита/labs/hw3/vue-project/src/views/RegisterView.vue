<template>
  <div class="d-flex align-items-center min-vh-100 position-relative">
    <main class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-sm p-4">
            <div class="card-body">
              <h1 class="h4 card-title text-center mb-4">Регистрация</h1>

              <div v-if="error" class="alert alert-danger">{{ error }}</div>

              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">Имя и Фамилия</label>
                  <input type="text" class="form-control" v-model="name" required placeholder="Иван Иванов">
                </div>
                <div class="mb-3">
                  <label class="form-label">Email адрес</label>
                  <input type="email" class="form-control" v-model="email" required placeholder="ivan@mail.ru">
                </div>
                <div class="mb-3">
                  <label class="form-label">Пароль</label>
                  <input type="password" class="form-control" v-model="password" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Подтвердите пароль</label>
                  <input type="password" class="form-control" v-model="confirm" required>
                </div>
                <button type="submit" class="btn btn-success w-100 mb-3">Зарегистрироваться</button>
              </form>
              <div class="text-center">
                <small>Уже есть аккаунт? <router-link to="/login">Войти</router-link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirm.value) {
    error.value = 'Пароли не совпадают!'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/users')
    const users = await res.json()
    const existing = users.find(u => u.email === email.value)

    if (existing) {
      error.value = 'Пользователь с таким Email уже существует!'
      return
    }

    const newUser = { name: name.value, email: email.value, password: password.value, baseBalance: 0 }
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })

    const createdUser = await response.json()
    localStorage.setItem('app_session', JSON.stringify(createdUser))
    router.push('/')
  } catch (err) {
    error.value = 'Сервер недоступен. Запустите json-server!'
  }
}
</script>