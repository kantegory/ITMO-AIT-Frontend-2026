<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container my-4" id="main-content">
      <div class="row g-4">
        <!-- Левая колонка: аватар и кнопки -->
        <div class="col-md-4">
          <section class="card" aria-labelledby="profile-card-title">
            <div class="card-body text-center">
              <div class="profile-avatar mb-3">
                <span class="profile-avatar-initials">{{ initials }}</span>
              </div>
              <h1 class="h5 mb-1" id="profile-card-title">{{ currentUser?.name || 'Пользователь' }}</h1>
              <p class="small text-muted mb-3">{{ currentUser?.email }}</p>
              <button class="btn btn-outline-danger btn-sm w-100 mb-2" @click="handleLogout">
                Выйти из аккаунта
              </button>
              <button class="btn btn-outline-secondary btn-sm w-100" @click="toggleTheme">
                {{ theme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема' }}
              </button>
            </div>
          </section>
        </div>

        <!-- Правая колонка: формы -->
        <div class="col-md-8">
          <!-- Основные данные -->
          <section class="card mb-3" aria-labelledby="profile-main-data-title">
            <div class="card-body">
              <h2 class="h6 mb-3" id="profile-main-data-title">Основные данные</h2>
              <form @submit.prevent="handleUpdateProfile">
                <div class="mb-3">
                  <label class="form-label" for="profile-name">Никнейм</label>
                  <input id="profile-name" type="text" class="form-control" v-model="profileName" autocomplete="name" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="profile-email">Email</label>
                  <input id="profile-email" type="email" class="form-control" v-model="profileEmail" autocomplete="email" />
                </div>
                <div v-if="profileSuccess" class="mb-2">
                  <small class="text-success">{{ profileSuccess }}</small>
                </div>
                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
              </form>
            </div>
          </section>

          <!-- Смена пароля -->
          <section class="card" aria-labelledby="profile-password-title">
            <div class="card-body">
              <h2 class="h6 mb-3" id="profile-password-title">Изменение пароля</h2>
              <form @submit.prevent="handleUpdatePassword">
                <div class="mb-3">
                  <label class="form-label" for="current-password">Текущий пароль</label>
                  <input id="current-password" type="password" class="form-control" v-model="currentPassword" autocomplete="current-password" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="new-password">Новый пароль</label>
                  <input id="new-password" type="password" class="form-control" v-model="newPassword" autocomplete="new-password" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="new-password-confirm">Повторите новый пароль</label>
                  <input id="new-password-confirm" type="password" class="form-control" v-model="newPasswordConfirm" autocomplete="new-password" />
                </div>
                <div v-if="passwordError" class="mb-2">
                  <small class="text-danger">{{ passwordError }}</small>
                </div>
                <div v-if="passwordSuccess" class="mb-2">
                  <small class="text-success">{{ passwordSuccess }}</small>
                </div>
                <button type="submit" class="btn btn-primary">Обновить пароль</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useTheme } from '@/composables/useTheme'
import { getUserById } from '@/api/users'

const router = useRouter()
const auth = useAuthStore()
const { currentUser } = useCurrentUser()
const { theme, toggleTheme } = useTheme()

const profileName = ref('')
const profileEmail = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const profileSuccess = ref('')

const initials = computed(() => {
  const name = currentUser.value?.name || ''
  const parts = name.trim().split(' ')
  const first = parts[0]?.[0] || ''
  const second = parts[1]?.[0] || ''
  return (first + second).toUpperCase() || 'U'
})

onMounted(() => {
  if (currentUser.value) {
    profileName.value = currentUser.value.name || ''
    profileEmail.value = currentUser.value.email || ''
  }
})

async function handleUpdateProfile() {
  profileSuccess.value = ''
  await auth.updateProfile({ name: profileName.value.trim(), email: profileEmail.value.trim() })
  profileSuccess.value = 'Данные сохранены'
  setTimeout(() => { profileSuccess.value = '' }, 2000)
}

async function handleUpdatePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  if (newPassword.value !== newPasswordConfirm.value) {
    passwordError.value = 'Новый пароль и подтверждение не совпадают'
    return
  }
  const { data: userFromServer } = await getUserById(currentUser.value.id)
  if (userFromServer.password !== currentPassword.value) {
    passwordError.value = 'Неверный текущий пароль'
    return
  }
  await auth.updateProfile({ password: newPassword.value })
  currentPassword.value = ''
  newPassword.value = ''
  newPasswordConfirm.value = ''
  passwordSuccess.value = 'Пароль обновлён'
  setTimeout(() => { passwordSuccess.value = '' }, 2000)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>