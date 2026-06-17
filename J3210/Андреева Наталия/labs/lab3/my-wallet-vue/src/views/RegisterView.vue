<template>
  <main class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="col-12 col-md-4 card p-4 shadow-sm border-0">
      <h1 class="h3 mb-4 text-center">Регистрация</h1>
      <input v-model="name" type="text" class="form-control mb-3" placeholder="Имя">
      <input v-model="surname" type="text" class="form-control mb-3" placeholder="Фамилия">
      <input v-model="email" type="email" class="form-control mb-3" placeholder="Email">
      <input v-model="pass" type="password" class="form-control mb-4" placeholder="Пароль">
      <button @click="handleRegister" class="btn btn-success w-100 py-2">Зарегистрироваться</button>
      <router-link to="/login" class="btn btn-outline-secondary w-100 mt-3">Назад ко входу</router-link>
    </div>
  </main>
</template>

<script setup>
import {ref} from 'vue'
import {useAuth} from '../composables/useAuth'

const name = ref('')
const surname = ref('')
const email = ref('')
const pass = ref('')
const {register} = useAuth()

const handleRegister = () => {
  if (!name.value || !surname.value || !email.value || !pass.value) return alert("Заполните все поля!")
  register(name.value, surname.value, email.value, pass.value)
}
</script>