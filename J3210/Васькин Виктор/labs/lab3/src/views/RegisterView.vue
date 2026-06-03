<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import instance from '@/api/instance'
import { useAuthStore } from '@/stores/auth'
import BaseLayout from '@/layouts/BaseLayout.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const router = useRouter()
const authStore = useAuthStore()

const onRegister = async () => {
  try {
    const response = await instance.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    })

    authStore.login(response.data.user, response.data.accessToken)
    router.push('/')
  } catch (e) {
    alert('Ошибка регистрации. Возможно, такой email уже есть.')
  }
}
</script>

<template>
  <BaseLayout>
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <div class="auth-card p-4 p-md-5">
          <h2 class="text-white fw-bold mb-4 text-center">Начни свой путь</h2>
          <form @submit.prevent="onRegister">
            <div class="mb-3"><label class="form-label text-white-50">Как к Вам обращаться?</label><input type="text" v-model="name" class="form-control bg-dark text-white border-secondary px-3 py-2" placeholder="Иван Олегович" required></div>
            <div class="mb-3"><label class="form-label text-white-50">Email</label><input type="email" v-model="email" class="form-control bg-dark text-white border-secondary px-3 py-2" placeholder="skibidi@email.com" required></div>
            <div class="mb-3"><label class="form-label text-white-50">Пароль</label><input type="password" v-model="password" class="form-control bg-dark text-white border-secondary px-3 py-2" placeholder="Минимум 8 символов" required></div>
            <div class="mb-4"><label class="form-label text-white-50">Кто Вы?</label><select v-model="role" class="form-select bg-dark text-white border-secondary py-2"><option value="student">Студент (хочу учиться)</option><option value="teacher">Преподаватель (хочу учить)</option></select></div>
            <button type="submit" class="btn btn-neon w-100 rounded-pill py-2 fw-bold">Создать аккаунт</button>
          </form>
          <div class="text-center mt-4"><p class="text-white-50 mb-0">Уже есть аккаунт? <RouterLink to="/login" class="text-neon fw-bold">Войти</RouterLink></p></div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>