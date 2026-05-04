<template>
  <div>
    <Navbar />
    <main class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <picture>
            <source srcset="/assets/hero.avif" type="image/avif">
            <source srcset="/assets/hero.webp" type="image/webp">
            <img src="/assets/hero.jpg" class="img-fluid rounded shadow-sm mb-4">
          </picture>
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <svg class="icon icon-lg text-primary mb-3">
                <use href="/assets/sprite.svg#shield"></use>
              </svg>
              <h3 class="mt-2 mb-4">Вход в систему</h3>
              <form @submit.prevent="handleLogin">
                <div class="mb-3 text-start">
                  <label class="form-label">Email адрес</label>
                  <input type="email" class="form-control" v-model="form.email" required>
                </div>
                <div class="mb-4 text-start">
                  <label class="form-label">Пароль</label>
                  <input type="password" class="form-control" v-model="form.password" required>
                </div>
                <button class="btn btn-primary w-100 mb-3" type="submit">Войти</button>
                <router-link to="/register">Зарегистрироваться</router-link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const form = ref({ email: '', password: '' })

onMounted(() => {
  if (localStorage.getItem('accessToken')) router.push('/dashboard')
})

const handleLogin = async () => {
  try {
    const res = await authApi.post('/login', form.value)
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/dashboard')
  } catch (e) {
    alert("Ошибка входа")
  }
}
</script>
