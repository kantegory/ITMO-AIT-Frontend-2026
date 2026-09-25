<template>
  <main>
    <div class="terminal-wrapper">
      <div class="terminal-box">
        <div class="terminal-title" role="heading" aria-level="1">[ СИСТЕМА_СЧЁТ : ВХОД ]</div>

        <form id="loginForm" @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="loginEmail" class="input-prefix" style="cursor: pointer;">
              &gt; <span class="visually-hidden">Электронная почта</span>
            </label>
            <input type="email" id="loginEmail" v-model="email" class="terminal-input"
                   placeholder="TEST@MAIL.COM" required autocomplete="email">
          </div>

          <div class="input-group">
            <label for="loginPassword" class="input-prefix" style="cursor: pointer;">
              &gt; <span class="visually-hidden">Пароль</span>
            </label>
            <input type="password" id="loginPassword" v-model="password" class="terminal-input"
                   placeholder="ПАРОЛЬ (8 СИМВОЛОВ)" required autocomplete="current-password">
          </div>

          <button type="submit" class="terminal-btn" :disabled="!isFormValid" aria-label="Войти в систему">[ ВОЙТИ ]
          </button>
        </form>

        <router-link to="/register" class="terminal-link" aria-label="Зарегистрировать новый аккаунт">НЕТ_ДОСТУПА?[
          РЕГИСТРАЦИЯ ]
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import {useFormValidation} from '../composables/useFormValidation'

const email = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()
const {validateEmail, validatePassword} = useFormValidation()

const isFormValid = computed(() => {
  return validateEmail(email.value) && validatePassword(password.value)
})

const handleLogin = async () => {
  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      await router.push('/dashboard')
    } else {
      alert('ОШИБКА: НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ')
    }
  } catch (error) {
    alert("ОШИБКА СЕРВЕРА!")
  }
}
</script>