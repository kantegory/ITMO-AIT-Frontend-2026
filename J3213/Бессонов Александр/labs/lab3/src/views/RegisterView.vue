<script setup>
import { ArrowRight, Eye, EyeOff } from '@lucide/vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const accepted = ref(false)
const errorMessage = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  workspaceName: '',
  password: '',
})

function getErrorMessage(error) {
  const response = error.response?.data
  if (typeof response === 'string') return response
  return response?.message || error.message || 'Не удалось создать аккаунт.'
}

async function submit() {
  errorMessage.value = ''
  if (!accepted.value) {
    errorMessage.value = 'Необходимо принять условия использования.'
    return
  }
  try {
    await auth.register({ ...form })
    await router.replace('/dashboard')
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
}
</script>

<template>
  <AuthLayout
    registration
    showcase-eyebrow="Начните за пару минут"
    :showcase-lines="['Команда увидит', 'общую картину']"
    showcase-text="Создайте пространство, пригласите коллег и распределите первые задачи."
  >
    <div class="auth-heading">
      <p class="auth-eyebrow auth-eyebrow-dark">Новый аккаунт</p>
      <h2 id="registerTitle">Создайте пространство</h2>
      <p>Заполните форму — рабочее пространство появится сразу.</p>
    </div>

    <form class="auth-form" aria-labelledby="registerTitle" @submit.prevent="submit">
      <div class="auth-form-grid">
        <div><label for="firstName">Имя</label><input id="firstName" v-model.trim="form.firstName" type="text" autocomplete="given-name" placeholder="Александр" required /></div>
        <div><label for="lastName">Фамилия</label><input id="lastName" v-model.trim="form.lastName" type="text" autocomplete="family-name" placeholder="Бессонов" required /></div>
      </div>

      <label for="registerEmail">Электронная почта</label>
      <input id="registerEmail" v-model.trim="form.email" type="email" autocomplete="email" placeholder="name@example.ru" required />

      <label for="workspaceName">Название команды</label>
      <input id="workspaceName" v-model.trim="form.workspaceName" type="text" placeholder="Например, Digital Lab" required />

      <label for="registerPassword">Пароль</label>
      <div class="auth-input auth-input-plain">
        <input
          id="registerPassword"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          minlength="6"
          autocomplete="new-password"
          placeholder="Не менее 6 символов"
          required
        />
        <button type="button" class="password-toggle" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
          <EyeOff v-if="showPassword" :size="20" /><Eye v-else :size="20" />
        </button>
      </div>

      <label class="auth-checkbox"><input v-model="accepted" type="checkbox" /><span>Я принимаю <a href="#">условия использования</a></span></label>
      <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>

      <button class="auth-submit" type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Создаём…' : 'Создать аккаунт' }}<ArrowRight :size="20" />
      </button>
    </form>

    <p class="auth-switch">Уже зарегистрированы? <RouterLink to="/login">Войти</RouterLink></p>
  </AuthLayout>
</template>
