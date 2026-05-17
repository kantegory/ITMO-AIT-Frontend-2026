<template>
  <AppLayout title="Настройки">
    <div class="content-card">
      <div class="row g-0">
        <div class="col-lg-4 settings-avatar-col">
          <div class="settings-avatar-wrap">
            <div class="settings-avatar" role="img" aria-label="Аватар пользователя">
              <Icon name="user" :size="56" solid />
            </div>
            <div class="fw-bold fs-5 mt-3">{{ fullName || '—' }}</div>
            <div class="text-muted small mt-1">{{ user?.email || '—' }}</div>
          </div>
        </div>
        <div class="col-lg-8 settings-form-col">
          <h3 class="mb-4">Редактировать профиль</h3>
          <div v-if="success" class="alert alert-success py-2 mb-3">Изменения сохранены</div>
          <div v-if="error" class="alert alert-danger py-2 mb-3">Ошибка при сохранении</div>
          <form @submit.prevent="onSubmit">
            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <label class="form-label">Имя</label>
                <input v-model="form.firstName" type="text" class="form-control" placeholder="Иван" />
              </div>
              <div class="col-sm-6">
                <label class="form-label">Фамилия</label>
                <input v-model="form.lastName" type="text" class="form-control" placeholder="Иванов" />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com" />
            </div>
            <button type="submit" class="btn btn-primary px-4">Сохранить изменения</button>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import Icon from '../components/Icon.vue'
import { useAuth } from '../composables/useAuth.js'
import { usersApi } from '../api/resources.js'

const { user, fullName, setUser } = useAuth()

const form = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || ''
})
const success = ref(false)
const error = ref(false)

async function onSubmit() {
  success.value = false
  error.value = false
  try {
    const updated = await usersApi.update(user.value.id, { ...form })
    setUser(updated)
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch {
    error.value = true
  }
}
</script>
