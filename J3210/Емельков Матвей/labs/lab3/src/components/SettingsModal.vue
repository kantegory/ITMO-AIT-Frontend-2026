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
            <h5 class="modal-title" id="settingsModalTitle">{{ t('settings.title') }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">{{ t('settings.appearance') }}</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  role="switch"
                  :checked="theme === 'dark'"
                  @change="toggleTheme"
                >
                <label class="form-check-label" for="darkModeSwitch">{{ t('settings.darkMode') }}</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="interfaceLanguage" class="form-label fw-bold">{{ t('settings.language') }}</label>
              <select
                id="interfaceLanguage"
                class="form-select"
                :value="locale"
                @change="setLocale($event.target.value)"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-outline-danger" @click="handleDeleteProfile">
              {{ t('settings.deleteProfile') }}
            </button>
            <button type="button" class="btn btn-primary" @click="$emit('close')">{{ t('settings.save') }}</button>
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
import { useLocale } from '../composables/useLocale'

defineProps(['show'])
defineEmits(['close'])

const router = useRouter()
const { theme, toggleTheme } = useTheme()
const { currentUser, logout } = useAuth()
const { getExperiments, getModels, deleteExperiment, deleteModel, deleteUser } = useApi()
const { t, locale, setLocale } = useLocale()

async function handleDeleteProfile() {
  if (!confirm(t('settings.deleteConfirm'))) return
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
    alert(t('settings.deleteError'))
  }
}
</script>
