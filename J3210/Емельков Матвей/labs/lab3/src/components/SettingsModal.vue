<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settingsModalTitle"
      style="background: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModalTitle">Настройки профиля</h5>
            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Внешний вид</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  role="switch"
                  :checked="theme === 'dark'"
                  @change="toggleTheme"
                >
                <label class="form-check-label" for="darkModeSwitch">Темная тема</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="interfaceLanguage" class="form-label fw-bold">Язык интерфейса</label>
              <select id="interfaceLanguage" class="form-select">
                <option selected>Русский</option>
                <option>English</option>
              </select>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-outline-danger" @click="handleDeleteProfile">
              Удалить профиль
            </button>
            <button type="button" class="btn btn-primary" @click="$emit('close')">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

defineProps(['show'])
defineEmits(['close'])

const router = useRouter()
const { theme, toggleTheme } = useTheme()
const { currentUser, logout } = useAuth()
const { getExperiments, getModels, deleteExperiment, deleteModel, deleteUser } = useApi()

async function handleDeleteProfile() {
  if (!confirm('ВНИМАНИЕ! Это необратимое действие. Удалить профиль и все данные?')) return
  const user = currentUser.value
  try {
    const [expRes, modelsRes] = await Promise.all([
      getExperiments({ userId: user.id }),
      getModels({ userId: user.id }),
    ])
    await Promise.all([
      ...expRes.data.map(e => deleteExperiment(e.id)),
      ...modelsRes.data.map(m => deleteModel(m.id)),
    ])
    await deleteUser(user.id)
    logout()
    router.push('/login')
  } catch (e) {
    alert('Не удалось удалить профиль.')
  }
}
</script>
