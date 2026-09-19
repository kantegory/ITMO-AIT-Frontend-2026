<template>
  <div class="d-flex align-items-center min-vh-100 position-relative">
    <div class="position-absolute top-0 end-0 p-3"><button class="btn btn-outline-dark btn-sm" @click="toggleTheme" aria-label="Переключить тему" title="Сменить тему"><svg class="icon"><use :href="`/img/sprite.svg#icon-${currentTheme === 'dark' ? 'sun' : 'moon'}`"></use></svg></button></div>
    <main class="container" role="main"><div class="row justify-content-center"><div class="col-md-5 col-lg-4"><div class="card shadow-sm p-4"><div class="card-body">
      <h1 class="h4 card-title text-center mb-4">Вход в систему</h1>
      <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">{{ error }}</div>
      <form @submit.prevent="login" aria-label="Форма авторизации"><div class="mb-3"><label for="login-email" class="form-label">Email адрес</label><input id="login-email" v-model="email" type="email" class="form-control" required autocomplete="email" placeholder="ivan@mail.ru"></div><div class="mb-3"><label for="login-password" class="form-label">Пароль</label><input id="login-password" v-model="password" type="password" class="form-control" required autocomplete="current-password"></div><button type="submit" class="btn btn-primary w-100 mb-3">Войти</button></form>
      <div class="text-center"><small>Еще нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></small></div>
    </div></div></div></div></main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const email = ref(''); const password = ref(''); const error = ref('')
const router = useRouter(); const { setUser } = useAuth(); const { currentTheme, toggleTheme } = useTheme()

const login = async () => {
  error.value = ''
  try {
    const { data } = await usersApi.login(email.value.trim())
    const user = data.find((candidate) => candidate.password === password.value)
    if (!user) { error.value = 'Неверный Email или пароль!'; return }
    setUser(user); router.push('/')
  } catch { error.value = 'Сервер недоступен. Запустите json-server!' }
}
</script>
