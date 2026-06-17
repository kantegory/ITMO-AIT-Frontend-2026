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

        <div v-if="action.error.value" class="err-msg">{{ action.error.value }}</div>

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

        <button class="btn-accent w-100" @click="doLogin" :disabled="action.loading.value">
          {{ action.loading.value ? 'Вход...' : 'Войти' }}
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

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import SvgSprite from '@/components/SvgSprite.vue'
import { useAuthStore } from '@/stores/auth'
import { useAsyncAction } from '@/composables/useAsyncAction'

const router = useRouter()
const authStore = useAuthStore()
const action = useAsyncAction()

const form = reactive({ email: '', password: '' })

async function doLogin() {
  if (!form.email || !form.password) {
    action.error.value = 'Заполните все поля'
    return
  }
  await action.execute(async () => {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  })
}
</script>
