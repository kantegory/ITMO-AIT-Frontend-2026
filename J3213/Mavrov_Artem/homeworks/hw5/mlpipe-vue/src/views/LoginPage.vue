<template>
  <div class="auth-screen">
    <SvgSprite />
    <div class="auth-center">
      <div class="auth-brand">
        <div class="brand-icon">
          <svg class="svg-icon"><use href="#icon-diagram-3-fill"></use></svg>
        </div>
        <span class="brand-name">MLPipe</span>
      </div>

      <div class="auth-card">
        <div class="auth-title">Вход в систему</div>
        <div class="auth-sub">ML Experiment Tracker</div>

        <div v-if="error" class="err-msg">{{ error }}</div>

        <div class="mb-3">
          <label class="flabel" for="li-email">Email</label>
          <input id="li-email" v-model="form.email" type="email"
                 class="finput" placeholder="admin@ml.pipe"
                 autocomplete="email" aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="flabel" for="li-pass">Пароль</label>
          <input id="li-pass" v-model="form.password" type="password"
                 class="finput" placeholder="••••••••"
                 autocomplete="current-password" aria-required="true" />
        </div>

        <button class="btn-accent w-100" @click="doLogin" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>

        <div class="auth-switch">
          Нет аккаунта? <a @click="$router.push('/register')">Зарегистрироваться</a>
        </div>

        <div class="demo-hint">
          admin@ml.pipe / admin123<br>
          user@ml.pipe / user123
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgSprite from '@/components/SvgSprite.vue'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginPage',
  components: { SvgSprite },

  data() {
    return {
      form: { email: '', password: '' },
      error: '',
      loading: false
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['login']),

    async doLogin() {
      this.error = ''
      if (!this.form.email || !this.form.password) {
        this.error = 'Заполните все поля'
        return
      }
      this.loading = true
      try {
        await this.login(this.form.email, this.form.password)
        this.$router.push('/dashboard')
      } catch (e) {
        this.error = e.response?.data?.error || 'Ошибка входа'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
