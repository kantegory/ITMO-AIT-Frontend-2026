<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают')
    return
  }

  localStorage.setItem('user', JSON.stringify({
    name: name.value,
    email: email.value,
    role: role.value,
  }))

  router.push('/profile')
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-7 col-lg-6">
      <div class="card shadow">
        <div class="card-body p-4">
          <h1 class="text-center mb-4">Регистрация</h1>

          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="name" class="form-label">Имя</label>

              <input
                id="name"
                v-model="name"
                type="text"
                class="form-control"
                placeholder="Введите имя"
                required
              >
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>

              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Введите email"
                required
              >
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>

              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Введите пароль"
                required
              >
            </div>

            <div class="mb-3">
              <label for="confirmPassword" class="form-label">
                Подтверждение пароля
              </label>

              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                class="form-control"
                placeholder="Повторите пароль"
                required
              >
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">Роль</label>

              <select
                id="role"
                v-model="role"
                class="form-select"
                required
              >
                <option value="student">Студент</option>
                <option value="teacher">Преподаватель</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>