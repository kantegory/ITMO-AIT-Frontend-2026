<template>
  <main class="container d-flex align-items-center justify-content-center vh-100">
    <div class="row justify-content-center w-100">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="glass p-5">
          
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="fw-bold mb-0">
              <svg width="40" height="40" class="me-2"><use href="#icon-logo"></use></svg>NexusEdu
            </h1>
            <button @click="toggleTheme" class="btn btn-sm btn-outline-secondary rounded-pill">
              <svg width="18" height="18"><use href="#icon-theme"></use></svg><span>Тема</span>
            </button>
          </div>

          <ul class="nav nav-pills nav-justified mb-4">
            <li class="nav-item">
              <button class="nav-link fw-bold" :class="{ active: isLoginTab }" @click="isLoginTab = true">Вход</button>
            </li>
            <li class="nav-item">
              <button class="nav-link fw-bold" :class="{ active: !isLoginTab }" @click="isLoginTab = false">Регистрация</button>
            </li>
          </ul>

          <div class="tab-content">
            <div v-if="isLoginTab" class="tab-pane fade show active">
              <form @submit.prevent="handleLogin">
                <input v-model="loginForm.email" type="email" class="form-control glass-input mb-3 py-2" placeholder="Email" required>
                <input v-model="loginForm.password" type="password" class="form-control glass-input mb-4 py-2" placeholder="Пароль" required>
                <button type="submit" class="btn glass-btn w-100 py-2 fs-5">Войти</button>
              </form>
            </div>

            <div v-else class="tab-pane fade show active">
              <form @submit.prevent="handleRegister">
                <input v-model="registerForm.firstName" type="text" class="form-control glass-input mb-3 py-2" placeholder="Имя" required>
                <input v-model="registerForm.lastName" type="text" class="form-control glass-input mb-3 py-2" placeholder="Фамилия" required>
                <input v-model="registerForm.email" type="email" class="form-control glass-input mb-3 py-2" placeholder="Email" required>
                <input v-model="registerForm.password" type="password" class="form-control glass-input mb-4 py-2" placeholder="Пароль" required>
                <button type="submit" class="btn glass-btn w-100 py-2 fs-5">Создать аккаунт</button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'

const { toggleTheme } = useTheme()
const { login, register } = useAuth()

const isLoginTab = ref(true)

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ firstName: '', lastName: '', email: '', password: '' })

const handleLogin = () => {
  login(loginForm.email, loginForm.password)
}

const handleRegister = () => {
  register(registerForm.firstName, registerForm.lastName, registerForm.email, registerForm.password)
}
</script>