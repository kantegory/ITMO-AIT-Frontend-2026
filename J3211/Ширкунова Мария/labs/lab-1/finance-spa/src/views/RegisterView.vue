<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { register } = useAuth()
const form = reactive({ firstName: '', email: '', password: '' })
const errorMsg = ref('')

const onSubmit = async () => {
  errorMsg.value = ''
  try {
    await register(form)
  } catch (e) {
    errorMsg.value = 'Ошибка регистрации: ' + (e.response?.data || e.message)
  }
}
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <article class="card shadow p-4" style="width: 100%; max-width: 450px;">
      <div class="card-body">
        <h1 class="card-title text-center mb-4 h3">Создать аккаунт</h1>
        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Имя</label>
            <input class="form-control" v-model="form.firstName" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email адрес</label>
            <input type="email" class="form-control" v-model="form.email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input type="password" class="form-control" v-model="form.password" required>
          </div>
          <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
          <button type="submit" class="btn btn-primary w-100 mb-3">Зарегистрироваться</button>
          <div class="text-center">
            <span class="text-muted">Уже есть аккаунт?</span>
            <router-link to="/login">Войти</router-link>
          </div>
        </form>
      </div>
    </article>
  </main>
</template>
