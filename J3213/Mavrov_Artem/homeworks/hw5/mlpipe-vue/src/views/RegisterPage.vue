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
        <div class="auth-title">Регистрация</div>
        <div class="auth-sub">Создайте аккаунт MLPipe</div>

        <div v-if="error" class="err-msg">{{ error }}</div>

        <div class="mb-3">
          <label class="flabel" for="reg-name">Имя</label>
          <input id="reg-name" v-model="form.name" type="text"
                 class="finput" placeholder="ml_engineer"
                 autocomplete="username" aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="flabel" for="reg-email">Email</label>
          <input id="reg-email" v-model="form.email" type="email"
                 class="finput" placeholder="user@ml.pipe"
                 autocomplete="email" aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="flabel" for="reg-pass">Пароль</label>
          <input id="reg-pass" v-model="form.password" type="password"
                 class="finput" placeholder="минимум 6 символов"
                 autocomplete="new-password" aria-required="true" />
        </div>
        <div class="mb-3">
          <label class="flabel" for="reg-role">Роль</label>
          <select id="reg-role" v-model="form.role" class="finput">
            <option value="ML Engineer">ML Engineer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button class="btn-accent w-100" @click="doRegister" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <div class="auth-switch">
          Уже есть аккаунт? <a @click="$router.push('/login')">Войти</a>
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
  name: 'RegisterPage',
  components: { SvgSprite },

  data() {
    return {
      form: { name: '', email: '', password: '', role: 'ML Engineer' },
      error: '',
      loading: false
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['register']),

    async doRegister() {
      this.error = ''
      if (!this.form.name || !this.form.email || this.form.password.length < 6) {
        this.error = 'Заполните все поля. Пароль минимум 6 символов.'
        return
      }
      this.loading = true
      try {
        await this.register(this.form.name, this.form.email, this.form.password, this.form.role)
        this.$router.push('/dashboard')
      } catch (e) {
        this.error = e.response?.data?.error || 'Ошибка регистрации'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
