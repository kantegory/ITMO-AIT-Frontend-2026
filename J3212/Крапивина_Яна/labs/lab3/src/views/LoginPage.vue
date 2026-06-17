<template>
  <base-layout>
    <div class="custom-card mx-auto mt-5" style="max-width: 400px;">
      <h3 class="fw-bold text-center mb-4">Вход в систему</h3>
      
      <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label small" for="emailInput">Email</label>
            <input type="email" id="emailInput" v-model="form.email" class="custom-input" placeholder="name@example.com" required>
          </div>
          
          <div class="mb-4">
            <label class="form-label small" for="passInput">Пароль</label>
            <input type="password" id="passInput" v-model="form.password" class="custom-input" placeholder="********" required>
          </div>
          
          <button type="submit" class="btn-custom">Войти</button>
          
          <div class="text-center mt-4">
              <span class="text-muted">Нет аккаунта?</span>
              <router-link to="/register" class="link-custom ms-2" style="color: var(--gold-accent) !important; font-weight: 600;">Регистрация</router-link>
          </div>
      </form>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import { authService } from '../api/auth'

export default {
  components: { BaseLayout },
  data() { return { form: { email: '', password: '' } } },
  methods: {
    async login() {
      const res = await authService.login(this.form.email, this.form.password);
      if (res.success) this.$router.push('/');
      else alert('Ошибка входа');
    }
  }
}
</script>