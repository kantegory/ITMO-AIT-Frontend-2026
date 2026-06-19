<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Вход в аккаунт</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <use href="/images/sprite.svg#icon-envelope"></use>
                    </svg>
                  </span>
                  <input type="email" class="form-control" id="email" v-model="email" placeholder="example@mail.ru" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <use href="/images/sprite.svg#icon-lock"></use>
                    </svg>
                  </span>
                  <input type="password" class="form-control" id="password" v-model="password" placeholder="********" required>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Войти</button>
            </form>
            <div class="text-center mt-3">
              <router-link to="/register">Нет аккаунта? Зарегистрируйтесь</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      try {
        const response = await fetch('http://localhost:3000/users')
        const users = await response.json()
        const user = users.find(u => u.email === email.value && u.password === password.value)

        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
          alert(`Добро пожаловать, ${user.name}!`)
          router.push('/profile')
        } else {
          alert('Неверный email или пароль')
        }
      } catch (error) {
        console.error('Ошибка входа:', error)
        alert('Ошибка сервера. Убедитесь, что JSON Server запущен на порту 3000')
      }
    }

    return { email, password, handleLogin }
  }
}
</script>