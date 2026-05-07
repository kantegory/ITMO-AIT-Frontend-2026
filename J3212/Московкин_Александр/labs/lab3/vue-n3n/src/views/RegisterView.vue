<template>
  <main class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h1 class="h4 mb-3 text-center">
          <span class="logo-n3n">
            <span class="logo-n3n-black">n</span><span class="logo-n3n-red">3</span><span class="logo-n3n-black">n</span>
          </span>
        </h1>

        <form @submit.prevent="handleRegister" novalidate>
          <div class="mb-3">
            <label class="form-label" for="reg-name">Никнейм</label>
            <input id="reg-name" type="text" class="form-control" v-model="name" autocomplete="name" required />
          </div>
          <div class="mb-3">
            <label class="form-label" for="reg-email">Email</label>
            <input id="reg-email" type="email" class="form-control" v-model="email" autocomplete="email" required />
          </div>
          <div class="mb-3">
            <label class="form-label" for="reg-password">Пароль</label>
            <input id="reg-password" type="password" class="form-control" v-model="password" autocomplete="new-password" required />
          </div>
          <div class="mb-3">
            <label class="form-label" for="reg-password-confirm">Повторите пароль</label>
            <input id="reg-password-confirm" type="password" class="form-control" v-model="passwordConfirm" autocomplete="new-password" required />
          </div>
          <div v-if="error" class="mb-3">
            <small class="text-danger">{{ error }}</small>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <div class="text-center mt-3">
          <router-link to="/login" class="small">Уже есть аккаунт? Войти</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    await auth.register(name.value.trim(), email.value.trim(), password.value.trim())
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>