<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4 shadow">
        <h3 class="text-center mb-4">Вход</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Кто вы?</label>
            <div class="d-flex gap-3">
              <label><input type="radio" v-model="role" value="student" checked> 🧑‍🎓 Ученик</label>
              <label><input type="radio" v-model="role" value="instructor"> 👨‍🏫 Инструктор</label>
            </div>
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" type="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Пароль</label>
            <input v-model="password" type="password" class="form-control" required>
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <button class="btn btn-danger w-100">Войти</button>
        </form>
        <router-link to="/register" class="d-block text-center mt-3">Еще нет аккаунта? Зарегистрироваться</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { login } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('student')
const error = ref('')

async function handleLogin() {
  const res = await login(email.value, password.value, role.value)
  if (res.success) {
    router.push(role.value === 'student' ? '/student' : '/instructor/dashboard')
  } else {
    error.value = res.error
  }
}
</script>