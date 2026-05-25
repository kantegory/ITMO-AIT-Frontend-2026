<script setup>
import { ref, onMounted, inject } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const { get, patch } = useApi()
const { session, getInitials } = useAuth()

const theme       = inject('theme')
const toggleTheme = inject('toggleTheme')

const firstName = ref('')
const lastName  = ref('')
const email     = ref('')
const about     = ref('')
const loading   = ref(true)
const saving    = ref(false)
const saved     = ref(false)

onMounted(async () => {
  try {
    const user = await get(`/users/${session.value.userId}`)
    firstName.value = user.firstName || ''
    lastName.value  = user.lastName  || ''
    email.value     = user.email     || ''
    about.value     = user.about     || ''
  } catch {
    firstName.value = session.value?.firstName || ''
    lastName.value  = session.value?.lastName  || ''
    email.value     = session.value?.email     || ''
  } finally {
    loading.value = false
  }
})

async function saveProfile() {
  saving.value = true
  saved.value  = false
  try {
    await patch(`/users/${session.value.userId}`, {
      firstName: firstName.value,
      lastName:  lastName.value,
      email:     email.value,
      about:     about.value,
    })
    const s = JSON.parse(localStorage.getItem('session'))
    localStorage.setItem('session', JSON.stringify({ ...s, firstName: firstName.value, lastName: lastName.value, email: email.value }))
    session.value = { ...session.value, firstName: firstName.value, lastName: lastName.value, email: email.value }
    saved.value = true
    setTimeout(() => { saved.value = false }, 2500)
  } catch {
    alert('Ошибка сохранения. Убедитесь, что json-server запущен.')
  } finally {
    saving.value = false
  }
}

function initials() {
  return (firstName.value.charAt(0) + lastName.value.charAt(0)).toUpperCase() || '??'
}
</script>

<template>
  <div class="main-wrapper">
    <AppSidebar />

    <div class="main-content">
      <h1 class="page-title mb-4">Настройки</h1>

      <div v-if="loading" style="color:var(--muted);">Загрузка…</div>
      <template v-else>
        <!-- Профиль -->
        <div class="settings-card">
          <div class="settings-title">Профиль</div>

          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="avatar-circle" style="width:54px;height:54px;font-size:18px;">{{ initials() }}</div>
            <div>
              <div style="font-size:14px;font-weight:500;color:var(--text);">{{ firstName }} {{ lastName }}</div>
              <div style="font-size:12px;color:var(--muted);">{{ session?.role === 'teacher' ? 'Преподаватель' : 'Студент' }}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
            <div>
              <label class="form-label-s">Имя</label>
              <input v-model="firstName" type="text" class="form-control-s">
            </div>
            <div>
              <label class="form-label-s">Фамилия</label>
              <input v-model="lastName" type="text" class="form-control-s">
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label class="form-label-s">Email</label>
            <input v-model="email" type="email" class="form-control-s">
          </div>

          <div style="margin-bottom:16px;">
            <label class="form-label-s">О себе</label>
            <textarea v-model="about" class="form-control-s" rows="3" style="resize:vertical;"></textarea>
          </div>

          <div class="d-flex align-items-center gap-3">
            <button class="btn-save" :disabled="saving" @click="saveProfile">
              {{ saving ? 'Сохраняем…' : 'Сохранить' }}
            </button>
            <span v-if="saved" style="font-size:13px;color:#1D9E75;">✓ Сохранено</span>
          </div>
        </div>

        <!-- Внешний вид -->
        <div class="settings-card">
          <div class="settings-title">Внешний вид</div>
          <div class="toggle-row">
            <div>
              <div style="font-size:14px;font-weight:500;color:var(--text);">Тёмная тема</div>
              <div style="font-size:12px;color:var(--muted);">Переключение светлой/тёмной темы</div>
            </div>
            <div class="toggle" :class="{ on: theme === 'dark' }" @click="toggleTheme"></div>
          </div>
        </div>

        <!-- Аккаунт -->
        <div class="settings-card">
          <div class="settings-title">Аккаунт</div>
          <div style="display:flex;gap:8px;">
            <button class="btn-save" disabled>Изменить пароль</button>
            <button class="btn-danger">Удалить аккаунт</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
