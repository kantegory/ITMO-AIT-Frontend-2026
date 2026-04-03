<template>
  <BaseLayout>
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="card-header text-center">
          <h1>
            <svg class="icon"><use xlink:href="/sprite.svg#icon-person-circle"></use></svg>
            Вход в FlyingOwl
          </h1>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="handleLogin">
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
                <input type="password" class="form-control" id="password" v-model="password" required placeholder="••••••••">
              </div>
            </div>
            
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-success" :disabled="isLoading">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-person-circle"></use></svg>
                {{ isLoading ? 'Вход...' : 'Войти' }}
              </button>
            </div>
          </form>
          
          <hr class="my-4">
          <div class="text-center">
            <p class="mb-0">Нет аккаунта? <RouterLink to="/register" class="text-decoration-none">Зарегистрироваться</RouterLink></p>
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

const { login, isLoading } = useAuth()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await login(email.value, password.value)
}
</script>