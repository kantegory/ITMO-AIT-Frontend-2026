<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Регистрация</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Имя</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <use href="/images/sprite.svg#icon-person"></use>
                    </svg>
                  </span>
                  <input type="text" class="form-control" id="name" v-model="name" placeholder="Введите имя" required>
                </div>
              </div>
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
                  <input type="password" class="form-control" id="password" v-model="password" placeholder="Минимум 6 символов" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="confirm_password" class="form-label">Подтверждение пароля</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <use href="/images/sprite.svg#icon-check"></use>
                    </svg>
                  </span>
                  <input type="password" class="form-control" id="confirm_password" v-model="confirmPassword" placeholder="Повторите пароль" required>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
            </form>
            <div class="text-center mt-3">
              <router-link to="/login">Уже есть аккаунт? Войдите</router-link>
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
  name: 'RegisterPage',
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const router = useRouter()

    const handleRegister = async () => {
      if (!name.value || !email.value || !password.value || !confirmPassword.value) {
        alert('Заполните все поля')
        return
      }

      if (password.value !== confirmPassword.value) {
        alert('Пароли не совпадают')
        return
      }

      if (password.value.length < 6) {
        alert('Пароль должен быть не менее 6 символов')
        return
      }

      try {
        // Получаем существующих пользователей
        const response = await fetch('http://localhost:3000/users')
        const users = await response.json()

        // Проверяем, существует ли пользователь с таким email
        if (users.find(u => u.email === email.value)) {
          alert('Пользователь с таким email уже существует')
          return
        }

        // Создаём нового пользователя
        const newUser = {
          id: Date.now().toString(),
          name: name.value,
          email: email.value,
          password: password.value
        }

        const createResponse = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })

        if (createResponse.ok) {
          alert('Регистрация успешна! Теперь войдите в аккаунт.')
          router.push('/login')
        } else {
          alert('Ошибка при регистрации')
        }
      } catch (error) {
        console.error('Ошибка регистрации:', error)
        alert('Ошибка сервера. Убедитесь, что JSON Server запущен на порту 3000')
      }
    }

    return { name, email, password, confirmPassword, handleRegister }
  }
}
</script>