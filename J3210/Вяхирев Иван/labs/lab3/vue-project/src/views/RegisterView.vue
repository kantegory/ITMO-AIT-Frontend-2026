<template>
  <div>
    <Navbar />
    <main class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <svg class="icon icon-lg text-primary mb-3">
                <use href="/assets/sprite.svg#robot"></use>
              </svg>
              <h3 class="mt-2 mb-4">Регистрация</h3>
              <form @submit.prevent="handleRegister">
                <div class="mb-3 text-start">
                  <label class="form-label">Email адрес</label>
                  <input type="email" class="form-control" v-model="form.email" required>
                </div>
                <div class="mb-3 text-start">
                  <label class="form-label">Пароль</label>
                  <input type="password" class="form-control" v-model="form.password" required>
                </div>
                <button class="btn btn-primary w-100 mb-3" type="submit">Зарегистрироваться</button>
                <router-link to="/login">Уже есть аккаунт? Войти</router-link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const form = ref({ email: '', password: '' })

const handleRegister = async () => {
  try {
    await authApi.post('/signup', form.value)
    alert("Регистрация успешна!")
    router.push('/login')
  } catch (e) {
    alert("Ошибка регистрации")
  }
}
</script>
