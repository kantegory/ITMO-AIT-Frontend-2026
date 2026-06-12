<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card shadow-lg border-0">
        <div class="card-body p-5">
          <h2 class="text-center mb-4">Регистрация</h2>
          <form @submit.prevent="handleRegister">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Имя</label>
                <input v-model="form.firstName" class="form-control" required>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Фамилия</label>
                <input v-model="form.lastName" class="form-control" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="form.password" type="password" class="form-control" required>
            </div>
            <div v-if="err" class="alert alert-danger">{{ err }}</div>
            <button type="submit" class="btn btn-success w-100" :disabled="loading">
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
          </form>
          <p class="text-center mt-3">
            Уже есть аккаунт? <router-link to="/login">Войти</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const form = reactive({
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'ivan2@mail.ru',
  password: '123456',
  phone: '+79991234567',
  role: 'user'
})
const err = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  err.value = ''
  try {
    await register(form)
    router.push('/profile')
  } catch (e) {
    err.value = e.response?.data?.message || e.message || 'Ошибка регистрации'
    console.error('Register error:', e)
  } finally {
    loading.value = false
  }
}
</script>