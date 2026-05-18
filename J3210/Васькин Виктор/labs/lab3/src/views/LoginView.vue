<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import instance from '@/api/instance'
import { useAuthStore } from '@/stores/auth'
import BaseLayout from '@/layouts/BaseLayout.vue'

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const router = useRouter()
const authStore = useAuthStore()

const onSubmit = async () => {
  try {
    errorMsg.value = ''
    const response = await instance.post('/login', {
      email: email.value,
      password: password.value
    })
    authStore.login(response.data.user, response.data.accessToken)
    router.push('/')
  } catch (error) {
    errorMsg.value = 'Неверный email или пароль'
  }
}
</script>

<template>
  <BaseLayout>
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="auth-card p-4 p-md-5">
          <h2 class="text-white fw-bold mb-4 text-center">С возвращением!</h2>
          
          <form @submit.prevent="onSubmit">
            <div v-if="errorMsg" class="alert alert-danger small py-2">{{ errorMsg }}</div>
            
            <div class="mb-3">
              <label class="form-label text-white-50">Email</label>
              <input type="email" v-model="email" class="form-control bg-dark text-white border-secondary px-3 py-2" placeholder="skibidi@email.com" required>
            </div>
            
            <div class="mb-4">
              <label class="form-label text-white-50">Пароль</label>
              <input type="password" v-model="password" class="form-control bg-dark text-white border-secondary px-3 py-2" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn btn-neon w-100 rounded-pill py-2 fw-bold">Войти в систему</button>
          </form>

          <div class="text-center mt-4">
            <p class="text-white-50 mb-0">Нет аккаунта? <RouterLink to="/register" class="text-neon fw-bold">Создать</RouterLink></p>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>