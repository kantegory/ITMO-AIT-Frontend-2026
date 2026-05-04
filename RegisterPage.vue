<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    await register(name.value, email.value, password.value)
    router.push('/cabinet')
  } catch (err) {
    error.value = 'Ошибка регистрации'
    console.error(err)
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4">Регистрация</h2>

    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label class="form-label">Имя</label>
        <input v-model="name" type="text" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Пароль</label>
        <input v-model="password" type="password" class="form-control" required>
      </div>

      <p v-if="error" class="text-danger">{{ error }}</p>

      <button class="btn btn-primary w-100" type="submit">
        Зарегистрироваться
      </button>
    </form>

    <p class="mt-3">
      Уже есть аккаунт?
      <RouterLink to="/login">Войти</RouterLink>
    </p>
  </div>
</template>