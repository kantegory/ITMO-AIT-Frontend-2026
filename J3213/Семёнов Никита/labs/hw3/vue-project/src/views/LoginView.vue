<template>
  <div class="d-flex align-items-center min-vh-100 position-relative">
    <main class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-sm p-4">
            <div class="card-body">
              <h1 class="h4 card-title text-center mb-4">Вход в систему</h1>
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Email адрес</label>
                  <input type="email" v-model="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Пароль</label>
                  <input type="password" v-model="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Войти</button>
              </form>
              <div class="text-center">
                <small>Еще нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></small>
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

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await fetch(`http://localhost:3000/users?email=${email.value}&password=${password.value}`)
    const users = await res.json()
    if (users.length > 0) {
      localStorage.setItem('app_session', JSON.stringify(users[0]))
      router.push('/')
    } else {
      error.value = 'Неверный Email или пароль!'
    }
  } catch (err) {
    error.value = 'Сервер недоступен. Запустите json-server!'
  }
}
</script>