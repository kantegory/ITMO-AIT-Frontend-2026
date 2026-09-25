<template>
  <main>
    <div class="terminal-wrapper">
      <div class="terminal-box">
        <div class="terminal-title" role="heading" aria-level="1">[ СИСТЕМА_СЧЁТ : РЕГИСТРАЦИЯ ]</div>

        <form id="loginForm" @submit.prevent="handleRegister">
          <div class="input-group">
            <label for="regEmail" class="input-prefix" style="cursor: pointer;">
              &gt; <span class="visually-hidden">Электронная почта для регистрации</span>
            </label>
            <input type="email" id="regEmail" v-model="email" class="terminal-input"
                   placeholder="TEST@MAIL.COM" required autocomplete="email">
          </div>

          <div class="input-group">
            <label for="regPassword" class="input-prefix" style="cursor: pointer;">
              &gt; <span class="visually-hidden">Придумайте пароль</span>
            </label>
            <input type="password" id="regPassword" v-model="password" class="terminal-input"
                   placeholder="ПАРОЛЬ (8 СИМВОЛОВ)" required autocomplete="new-password">
          </div>

          <button type="submit" class="terminal-btn" :disabled="!isFormValid" aria-label="Создать новый аккаунт">[
            СОЗДАТЬ_АККАУНТ ]
          </button>
        </form>

        <router-link to="/" class="terminal-link" aria-label="Вернуться на страницу входа">ЕСТЬ_АККАУНТ? [ ВХОД ]
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

const handleRegister = async () => {
  try {
    await authStore.register(email.value, password.value)
    alert('УСПЕХ: АККАУНТ СОЗДАН!')
    await router.push('/')
  } catch (error) {
    alert(error.message || "ОШИБКА СЕРВЕРА!")
  }
}
</script>