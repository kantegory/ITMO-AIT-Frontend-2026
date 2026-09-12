<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4 shadow">
        <h3 class="text-center mb-4">Регистрация</h3>
        <form @submit.prevent="handleRegister">
          <div class="row mb-3">
            <div class="col"><input v-model="name" class="form-control" placeholder="Имя" required></div>
            <div class="col"><input v-model="surname" class="form-control" placeholder="Фамилия" required></div>
          </div>
          <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required>
          <div class="row mb-3">
            <div class="col"><input v-model="pass" type="password" class="form-control" placeholder="Пароль" required></div>
            <div class="col"><input v-model="confirm" type="password" class="form-control" placeholder="Повторите пароль" required></div>
          </div>
          <div class="mb-3">
            <label class="form-label">Кто вы?</label>
            <div class="d-flex gap-3">
              <label><input type="radio" v-model="role" value="student" checked> 🧑‍🎓 Ученик</label>
              <label><input type="radio" v-model="role" value="instructor"> 👨‍🏫 Инструктор</label>
            </div>
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <button class="btn btn-danger w-100">Зарегистрироваться</button>
        </form>
        <router-link to="/login" class="d-block text-center mt-3">Уже есть аккаунт? Войти</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { register } = useAuth()
const router = useRouter()
const name = ref(''), surname = ref(''), email = ref(''), pass = ref(''), confirm = ref(''), role = ref('student')
const error = ref('')

async function handleRegister() {
  if (pass.value !== confirm.value) { error.value = 'Пароли не совпадают'; return }
  if (pass.value.length < 3) { error.value = 'Пароль минимум 3 символа'; return }

  const data = { name: `${name.value} ${surname.value}`, email: email.value, password: pass.value, role: role.value }
  const res = await register(data)
  if (res.success) {
    router.push(role.value === 'student' ? '/student' : '/instructor/dashboard')
  } else {
    error.value = res.error
  }
}
</script>