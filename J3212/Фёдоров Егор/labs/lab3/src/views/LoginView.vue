<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, authError, authLoading, isLoggedIn } = useAuth()

const form = reactive({
  email: 'egor@egor',
  password: 'qwe123',
})

if (isLoggedIn.value) {
  router.replace({ name: 'profile' })
}

async function submitLogin() {
  await login(form.email, form.password)
  router.push(route.query.redirect || { name: 'profile' })
}
</script>

<template>
  <main class="auth-page container">
    <section class="hub-card auth-card">
      <span class="hero-badge mb-3">ModelHub</span>
      <h1 class="fw-bold mb-2">Вход</h1>
      <p class="muted mb-4">Войдите, чтобы сохранять модели, датасеты и оставлять комментарии.</p>

      <form class="d-flex flex-column gap-3" @submit.prevent="submitLogin">
        <div>
          <label class="form-label fw-semibold" for="email">Email</label>
          <input id="email" v-model="form.email" class="form-control" type="email" required />
        </div>

        <div>
          <label class="form-label fw-semibold" for="password">Пароль</label>
          <input id="password" v-model="form.password" class="form-control" type="password" required />
        </div>

        <div v-if="authError" class="alert alert-danger mb-0">{{ authError }}</div>

        <button class="btn btn-primary" type="submit" :disabled="authLoading">
          {{ authLoading ? 'Входим…' : 'Войти' }}
        </button>

        <RouterLink :to="{ name: 'register' }" class="text-center">Создать аккаунт</RouterLink>
      </form>
    </section>
  </main>
</template>
