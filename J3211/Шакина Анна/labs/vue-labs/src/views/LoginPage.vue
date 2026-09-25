<template>
  <div class="auth-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="auth-shell w-100">
      <div class="auth-card p-4">
        <h2 class="mb-4 text-center">Вход</h2>
        <div v-if="error" class="auth-form-msg auth-form-msg--error mb-3">{{ error }}</div>
        <div class="d-flex flex-column gap-3">
          <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Email">
          <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Пароль">
          <button class="auth-btn" @click="handleLogin">Войти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import useAuthStore from '@/stores/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: { email: '', password: '' },
      error: ''
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    async handleLogin() {
      try {
        this.error = ''
        await this.login(this.form.email, this.form.password)
        this.$router.push('/')
      } catch {
        this.error = 'Неверный email или пароль'
      }
    }
  }
}
</script>