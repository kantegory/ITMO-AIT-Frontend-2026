<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, authError, authLoading, isLoggedIn } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
})

if (isLoggedIn.value) {
  router.replace({ name: 'profile' })
}

async function submitRegister() {
  await register(form)
  router.push({ name: 'profile' })
}
</script>

<template>
  <main class="auth-page container">
    <section class="hub-card auth-card auth-card-wide">
      <span class="hero-badge mb-3">ModelHub</span>
      <h1 class="fw-bold mb-2">Регистрация</h1>
      <p class="muted mb-4">Создайте профиль для работы с избранным, комментариями и публикациями.</p>

      <form class="row g-3" @submit.prevent="submitRegister">
        <div class="col-md-6">
          <label class="form-label fw-semibold" for="firstName">Имя</label>
          <input id="firstName" v-model="form.firstName" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold" for="lastName">Фамилия</label>
          <input id="lastName" v-model="form.lastName" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold" for="username">Логин</label>
          <input id="username" v-model="form.username" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold" for="email">Email</label>
          <input id="email" v-model="form.email" class="form-control" type="email" required />
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold" for="password">Пароль</label>
          <input id="password" v-model="form.password" class="form-control" type="password" minlength="6" required />
        </div>

        <div v-if="authError" class="col-12">
          <div class="alert alert-danger mb-0">{{ authError }}</div>
        </div>

        <div class="col-12 d-flex gap-2 align-items-center flex-wrap">
          <button class="btn btn-primary" type="submit" :disabled="authLoading">
            {{ authLoading ? 'Создаём…' : 'Зарегистрироваться' }}
          </button>
          <RouterLink :to="{ name: 'login' }">Уже есть аккаунт</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>
