<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const errorMsg = ref('')

const onSubmit = async () => {
  errorMsg.value = ''
  try {
    await login(form)
  } catch (e) {
    errorMsg.value = 'Неверный Email или пароль'
  }
}
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center vh-100">
    <article class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h1 class="card-title text-center mb-4 h3">Вход в систему</h1>
        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Email адрес</label>
            <input type="email" class="form-control" v-model="form.email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input type="password" class="form-control" v-model="form.password" required>
          </div>
          <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
          <button type="submit" class="btn btn-primary w-100 mb-3">Войти</button>
          <div class="text-center">
            <span class="text-muted">Нет аккаунта?</span>
            <router-link to="/register">Зарегистрироваться</router-link>
          </div>
        </form>
      </div>
    </article>
  </main>
</template>
