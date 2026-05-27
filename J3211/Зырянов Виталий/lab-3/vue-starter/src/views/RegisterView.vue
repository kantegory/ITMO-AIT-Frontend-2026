<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppAlert from '../components/AppAlert.vue'
import { useApi } from '../composables/useApi'
import { useSession } from '../composables/useSession'

const router = useRouter()
const { post } = useApi()
const { saveSession } = useSession()

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: 'Студент',
  bio: ''
})

const loading = ref(false)
const message = ref('')
const messageType = ref('info')

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

async function submit() {
  setMessage('')

  if (!form.firstName.trim() || !form.lastName.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) {
    setMessage('Заполните все обязательные поля', 'warning')
    return
  }

  loading.value = true

  try {
    const result = await post('/register', {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      role: form.role.trim(),
      bio: form.bio.trim()
    })

    saveSession(result.token, result.user, true)
    setMessage('Аккаунт создан. Перенаправляем в поиск...', 'success')

    setTimeout(() => {
      router.push({ name: 'search' })
    }, 400)
  } catch (error) {
    setMessage(error.message || 'Ошибка регистрации', 'danger')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-xl-10">
      <section class="hub-card p-4 p-md-5">
        <h1 class="section-title mb-3">Создай аккаунт</h1>

        <form class="row g-3" @submit.prevent="submit">
          <div class="col-md-6">
            <label for="firstName" class="form-label">Имя</label>
            <input id="firstName" v-model="form.firstName" class="form-control" type="text" required>
          </div>

          <div class="col-md-6">
            <label for="lastName" class="form-label">Фамилия</label>
            <input id="lastName" v-model="form.lastName" class="form-control" type="text" required>
          </div>

          <div class="col-md-6">
            <label for="username" class="form-label">Логин</label>
            <input id="username" v-model="form.username" class="form-control" type="text" required>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="form.email" class="form-control" type="email" required>
          </div>

          <div class="col-md-6">
            <label for="password" class="form-label">Пароль</label>
            <input id="password" v-model="form.password" class="form-control" type="password" required>
          </div>

          <div class="col-md-6">
            <label for="role" class="form-label">Роль</label>
            <select id="role" v-model="form.role" class="form-select">
              <option value="Исследователь">Исследователь</option>
              <option value="Инженер">Инженер</option>
              <option value="Студент">Студент</option>
              <option value="Организация">Организация</option>
            </select>
          </div>

          <div class="col-12">
            <label for="bio" class="form-label">Кратко о себе</label>
            <textarea id="bio" v-model="form.bio" class="form-control" rows="3" maxlength="240" />
          </div>

          <div class="col-12 d-grid d-sm-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              {{ loading ? 'Создаём аккаунт...' : 'Создать аккаунт' }}
            </button>
          </div>

          <div class="col-12">
            <AppAlert :type="messageType" :message="message" />
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
