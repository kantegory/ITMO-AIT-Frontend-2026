<template>
  <BaseLayout>
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="card-header text-center">
          <h1>
            <svg class="icon"><use xlink:href="/sprite.svg#icon-person"></use></svg>
            Регистрация
          </h1>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="name" class="form-label">Имя <span>*</span></label>
              <div class="input-group">
                <span class="input-group-text">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-person"></use></svg>
                </span>
                <input type="text" class="form-control" id="name" v-model="name" required placeholder="Ваше имя">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="email" class="form-label">Email <span>*</span></label>
              <div class="input-group">
                <span class="input-group-text">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-envelope"></use></svg>
                </span>
                <input type="email" class="form-control" id="email" v-model="email" required placeholder="example@mail.com">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Пароль <span>*</span></label>
              <div class="input-group">
                <span class="input-group-text">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-lock"></use></svg>
                </span>
                <input type="password" class="form-control" id="password" v-model="password" required placeholder="Минимум 8 символов">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Подтверждение пароля <span>*</span></label>
              <div class="input-group">
                <span class="input-group-text">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-lock"></use></svg>
                </span>
                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required placeholder="Повторите пароль">
              </div>
            </div>
            
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-success" :disabled="isLoading">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-person-circle"></use></svg>
                {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
            </div>
          </form>
          
          <hr class="my-4">
          <div class="text-center">
            <p class="mb-0">Уже есть аккаунт? <RouterLink to="/login" class="text-decoration-none">Войти</RouterLink></p>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseLayout from '@/components/layouts/AuthLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const { register, isLoading } = useAuth()
const { showNotification } = useNotification()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value.length < 8) {
    showNotification('Пароль должен быть минимум 8 символов.', true)
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showNotification('Пароли не совпадают.', true)
    return
  }
  
  await register(name.value, email.value, password.value)
}
</script>