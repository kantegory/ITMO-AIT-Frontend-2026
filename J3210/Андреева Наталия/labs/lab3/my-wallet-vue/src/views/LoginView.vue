<template>
  <main class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="col-12 col-md-4 card p-4 shadow-sm border-0">
      <h1 class="h3 mb-4 text-center">Вход в MyWallet</h1>
      <div class="mb-3">
        <input v-model="email" type="email" class="form-control" placeholder="Email" @keyup.enter="handleLogin">
      </div>
      <div class="mb-3">
        <input v-model="pass" type="password" class="form-control" placeholder="Пароль" @keyup.enter="handleLogin">
      </div>
      <button @click="handleLogin" class="btn btn-primary w-100 py-2 fw-bold">Войти</button>
      <router-link to="/register" class="btn btn-outline-primary w-100 mt-3">Регистрация</router-link>
    </div>
  </main>
</template>

<script setup>
import {ref} from 'vue'
import {useAuth} from '../composables/useAuth'

const email = ref('')
const pass = ref('')
const {login} = useAuth()

const handleLogin = () => {
  if (!email.value || !pass.value) return alert("Введите данные!")
  login(email.value, pass.value)
}
</script>