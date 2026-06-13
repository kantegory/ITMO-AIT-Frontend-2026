<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref('')

function submit() {
  if (!form.email || !form.password) {
    error.value = 'Заполните email и пароль.'
    return
  }
  login(form)
  router.push(route.query.redirect || { name: 'dashboard' })
}
</script>

<template>
  <section class="auth-card card shadow-sm p-4">
    <RouterLink class="brand d-flex justify-content-center align-items-center mb-4 text-decoration-none" :to="{ name: 'home' }">
      <svg class="bi me-2 text-primary" width="36" height="36"><use href="#airplane" /></svg>
      <span class="fs-3 fw-bold text-primary">TravelPlan</span>
    </RouterLink>
    <h1 class="h3 text-center mb-4">Вход</h1>
    <div v-if="error" class="alert alert-warning">{{ error }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3"><label class="form-label" for="email">Email</label><input id="email" v-model.trim="form.email" type="email" class="form-control" required></div>
      <div class="mb-4"><label class="form-label" for="password">Пароль</label><input id="password" v-model="form.password" type="password" class="form-control" required></div>
      <button type="submit" class="btn btn-primary w-100">Войти</button>
    </form>
    <p class="text-center mt-3 mb-0">Нет аккаунта? <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink></p>
    <ThemeToggle class="w-100" />
  </section>
</template>
