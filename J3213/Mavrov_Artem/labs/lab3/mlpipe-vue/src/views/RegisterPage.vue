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

        <div v-if="action.error.value" class="err-msg">{{ action.error.value }}</div>

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

        <button class="btn-accent w-100" @click="doRegister" :disabled="action.loading.value">
          {{ action.loading.value ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <div class="auth-switch">
          Уже есть аккаунт? <a @click="$router.push('/login')">Войти</a>
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

const form = reactive({ name: '', email: '', password: '', role: 'ML Engineer' })

async function doRegister() {
  if (!form.name || !form.email || form.password.length < 6) {
    action.error.value = 'Заполните все поля. Пароль минимум 6 символов.'
    return
  }
  await action.execute(async () => {
    await authStore.register(form.name, form.email, form.password, form.role)
    router.push('/dashboard')
  })
}
</script>
