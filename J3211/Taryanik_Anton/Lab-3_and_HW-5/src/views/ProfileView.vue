<template>
  <div>
    <AppNavbar />
    <main class="container my-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body py-5">
              <div class="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 96px; height: 96px; background-color: var(--lf-primary); font-size: 2rem; font-weight: 700;">
                {{ initials }}
              </div>
              <h4 class="fw-bold mb-1">{{ authStore.user?.name || 'Без имени' }}</h4>
              <p class="text-muted mb-4">{{ authStore.user?.email }}</p>
              <button @click="logout" class="btn btn-outline-danger btn-sm w-100">Выйти из аккаунта</button>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Личные данные</h5>
              <form @submit.prevent="updateProfile">
                <div class="mb-3">
                  <label class="form-label">Полное имя</label>
                  <input v-model="profileName" type="text" class="form-control" required autocomplete="name">
                </div>
                <div class="mb-4">
                  <label class="form-label">Email <span class="text-muted fw-normal small">(изменение недоступно)</span></label>
                  <input :value="authStore.user?.email" type="email" class="form-control bg-light text-muted" readonly>
                </div>
                <small v-if="profileSuccess" class="text-success fw-medium d-block mb-3">
                  Данные успешно обновлены
                </small>
                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Смена пароля</h5>
              <form @submit.prevent="updatePassword">
                <div class="mb-3">
                  <label class="form-label">Текущий пароль</label>
                  <input v-model="currentPassword" type="password" class="form-control" autocomplete="current-password">
                </div>
                <div class="mb-3">
                  <label class="form-label">Новый пароль</label>
                  <input v-model="newPassword" type="password" class="form-control" autocomplete="new-password">
                </div>
                <div class="mb-2">
                  <label class="form-label">Повторите новый пароль</label>
                  <input v-model="confirmNewPassword" type="password" class="form-control" autocomplete="new-password">
                </div>
                <div class="mb-3">
                  <small v-if="passwordErrorMsg" class="text-danger fw-medium d-block">{{ passwordErrorMsg }}</small>
                  <small v-if="passwordSuccess" class="text-success fw-medium d-block">Пароль успешно изменен</small>
                </div>
                <button type="submit" class="btn btn-outline-primary">Обновить пароль</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'

const authStore = useAuthStore()
const router = useRouter()

const profileName = ref(authStore.user?.name || '')
const profileSuccess = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const passwordErrorMsg = ref('')
const passwordSuccess = ref(false)

const initials = computed(() => {
  if (!authStore.user) return 'U'
  const parts = authStore.user.name.trim().split(' ')
  return ((parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '')).toUpperCase() || 'U'
})

const updateProfile = async () => {
  await authStore.updateProfile(authStore.user.id, profileName.value.trim())
  profileSuccess.value = true
  setTimeout(() => profileSuccess.value = false, 3000)
}

const updatePassword = async () => {
  passwordErrorMsg.value = ''
  passwordSuccess.value = false

  if (newPassword.value !== confirmNewPassword.value) {
    passwordErrorMsg.value = 'Новые пароли не совпадают.'
    return
  }
  if (currentPassword.value !== authStore.user.password) {
    passwordErrorMsg.value = 'Неверный текущий пароль.'
    return
  }

  await authStore.updatePassword(authStore.user.id, newPassword.value)
  passwordSuccess.value = true
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
  setTimeout(() => passwordSuccess.value = false, 3000)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>