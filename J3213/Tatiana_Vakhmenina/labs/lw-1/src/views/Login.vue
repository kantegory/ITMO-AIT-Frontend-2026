<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow border-0" style="max-width: 420px; width: 100%;">
      
      <h2 class="text-center mb-4 fw-bold text-primary">
        {{ isRegisterMode ? 'Создать аккаунт' : 'Finance ITMO' }}
      </h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Имя пользователя (Логин)</label>
          <input v-model="username" type="text" class="form-control" placeholder="Например: ivan_ivanov" required />
        </div>
        
        <div class="mb-3">
          <label class="form-label fw-semibold">Пароль</label>
          <input v-model="password" type="password" class="form-control" placeholder="Задайте пароль" required />
        </div>
        
        <div class="mb-4" v-if="isRegisterMode">
          <label class="form-label fw-semibold">Повторите пароль</label>
          <input v-model="passwordConfirm" type="password" class="form-control" placeholder="Введите пароль еще раз" required />
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 mb-3 fw-bold" :disabled="loading">
          <span v-if="loading">Пожалуйста, подождите...</span>
          <span v-else>{{ isRegisterMode ? 'Зарегистрироваться' : 'Войти в личный кабинет' }}</span>
        </button>

        <div class="text-center">
          <button type="button" class="btn btn-link btn-sm text-decoration-none" @click="switchMode">
            {{ isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFinance } from '../composables/useFinance'

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isRegisterMode = ref(false) // Управляет отображением формы

const router = useRouter()
const { login, registerAccount, loading } = useFinance()

const switchMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  username.value = ''
  password.value = ''
  passwordConfirm.value = ''
}

const handleSubmit = async () => {
  if (isRegisterMode.value) {
    // Проверка совпадения паролей на клиенте перед отправкой запроса
    if (password.value !== passwordConfirm.value) {
      alert('Пароли не совпадают!')
      return
    }
    
    const isRegistered = await registerAccount(username.value, password.value)
    if (isRegistered) {
      // После успешной регистрации переводим пользователя на форму входа
      isRegisterMode.value = false
      password.value = ''
      passwordConfirm.value = ''
    }
  } else {
    const isLoggedIn = await login(username.value, password.value)
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }
}
</script>