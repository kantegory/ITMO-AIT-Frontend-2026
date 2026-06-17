<template>
  <div>
    <Navbar/>
    <main id="main-content">
      <section class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
        <article class="card shadow-sm" style="width: 400px;">
          <section class="card-body p-4">
            <header>
              <h1 class="text-center mb-4">Вход</h1>
            </header>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" v-model="form.email" class="form-control" placeholder="user@example.com" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input type="password" v-model="form.password" class="form-control" placeholder="********" required>
              </div>
              <footer>
                <button type="submit" class="btn btn-primary w-100">Войти</button>
              </footer>
            </form>
            <footer class="text-center mt-3 mb-0 small">
              Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
            </footer>
          </section>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'LoginPage',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const form = reactive({ email: '', password: '' })

    const login = async () => {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        const data = await response.json()

        if (data.accessToken && data.user) {
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('user', JSON.stringify(data.user))
          await router.push('/')
        } else {
          alert('Ошибка: ' + (data.error || 'Неверные данные'))
        }
      } catch (error) {
        alert('Ошибка: ' + error.message)
      }
    }

    return {
      form,
      login
    }
  }
}
</script>
