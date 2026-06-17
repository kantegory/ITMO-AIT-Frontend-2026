<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePageTitle } from '@/composables/usePageTitle'

usePageTitle('Регистрация')

const firstName = ref('')
const lastName = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function handleRegister() {
  errorMessage.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Пароли не совпадают!'
    return
  }

  const result = await authStore.register({
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    email: email.value,
    password: password.value,
  })
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<template>
  <main class="d-flex justify-content-center align-items-center min-vh-100" id="registerMain">
    <div class="card border-3 rounded-4 auth-card auth-card-register" id="registerCard">
      <div class="card-body p-4 p-sm-5">
        
        <div class="text-center mb-4">
          <h1 class="h3 fw-bold text-primary mb-1">Регистрация</h1>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row g-3 mb-3">
            <div class="col-12 col-sm-6">
              <label for="firstName" class="form-label">Имя</label>
              <input type="text" class="form-control" id="firstName" v-model="firstName" placeholder="Иван" required>
            </div>
            <div class="col-12 col-sm-6">
              <label for="lastName" class="form-label">Фамилия</label>
              <input type="text" class="form-control" id="lastName" v-model="lastName" placeholder="Иванов" required>
            </div>
          </div>

          <div class="mb-3">
              <label for="username" class="form-label">Никнейм (Username)</label>
              <div class="input-group">
                  <span class="input-group-text" id="username-addon">@</span>
                  <input type="text" class="form-control" id="username" v-model="username" placeholder="ivan_data" required>
              </div>
          </div>

          <div class="mb-3">
            <label for="emailReg" class="form-label">Email адрес</label>
            <input type="email" class="form-control" id="emailReg" v-model="email" placeholder="name@example.com" required>
          </div>

          <div class="mb-3">
            <label for="passwordReg" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="passwordReg" v-model="password" placeholder="Минимум 8 символов" required>
            <div class="form-text">Используйте буквы, цифры и спец. символы.</div>
          </div>

          <div class="mb-4">
            <label for="passwordConfirm" class="form-label">Повторите пароль</label>
            <input type="password" class="form-control" id="passwordConfirm" v-model="passwordConfirm" required>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn bg-primary text-white w-100" id="registerSubmitButton">Создать аккаунт</button>

          <div class="text-center small text-blunted mt-3">
            Уже есть аккаунт? <router-link to="/login" class="text-decoration-none fw-bold" id="goToLoginLink">Войти</router-link>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>