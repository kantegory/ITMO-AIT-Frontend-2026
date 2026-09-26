<template>
  <div class="d-flex align-items-center min-vh-100 position-relative">
    <div class="position-absolute top-0 end-0 p-3"><button class="btn btn-outline-dark btn-sm" @click="toggleTheme" aria-label="Переключить тему" title="Сменить тему"><svg class="icon"><use :href="`/img/sprite.svg#icon-${currentTheme === 'dark' ? 'sun' : 'moon'}`"></use></svg></button></div>
    <main class="container" role="main"><div class="row justify-content-center"><div class="col-md-5 col-lg-4"><div class="card shadow-sm p-4"><div class="card-body">
      <h1 class="h4 card-title text-center mb-4">Регистрация</h1>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <form @submit.prevent="register" aria-label="Форма регистрации"><div class="mb-3"><label for="reg-name" class="form-label">Имя и Фамилия</label><input id="reg-name" v-model="name" type="text" class="form-control" required placeholder="Иван Иванов" autocomplete="name"></div><div class="mb-3"><label for="reg-email" class="form-label">Email адрес</label><input id="reg-email" v-model="email" type="email" class="form-control" required placeholder="ivan@mail.ru" autocomplete="email"></div><div class="mb-3"><label for="reg-password" class="form-label">Пароль</label><input id="reg-password" v-model="password" type="password" class="form-control" required autocomplete="new-password"></div><div class="mb-3"><label for="reg-confirm" class="form-label">Подтвердите пароль</label><input id="reg-confirm" v-model="confirm" type="password" class="form-control" required autocomplete="new-password"></div><button type="submit" class="btn btn-success w-100 mb-3">Зарегистрироваться</button></form>
      <div class="text-center"><small>Уже есть аккаунт? <router-link to="/login">Войти</router-link></small></div>
    </div></div></div></div></main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const name = ref(''); const email = ref(''); const password = ref(''); const confirm = ref(''); const error = ref('')
const router = useRouter(); const { setUser } = useAuth(); const { currentTheme, toggleTheme } = useTheme()

const register = async () => {
  error.value = ''
  if (password.value !== confirm.value) { error.value = 'Пароли не совпадают!'; return }
  try {
    const { data: existing } = await usersApi.findByEmail(email.value.trim())
    if (existing.length) { error.value = 'Пользователь с таким Email уже существует!'; return }
    const { data: user } = await usersApi.create({ name: name.value.trim(), email: email.value.trim(), password: password.value, baseBalance: 0 })
    setUser(user); router.push('/')
  } catch { error.value = 'Сервер недоступен. Запустите json-server!' }
}
</script>
