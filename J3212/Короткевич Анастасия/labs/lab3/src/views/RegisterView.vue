<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const error = ref('')
const form = reactive({ name: '', email: '', password: '' })

const submit = async () => {
  error.value = ''
  try {
    await register(form)
    router.push('/login')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>Регистрация</h1>
    <form @submit.prevent="submit">
      <label>Имя</label>
      <input v-model="form.name" required />
      <label>Email</label>
      <input v-model="form.email" type="email" required />
      <label>Пароль</label>
      <input v-model="form.password" type="password" required />
      <button class="primary-btn" type="submit">Зарегистрироваться</button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </form>
  </section>
</template>
