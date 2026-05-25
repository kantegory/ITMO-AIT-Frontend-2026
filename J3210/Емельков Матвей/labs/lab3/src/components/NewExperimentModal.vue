<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newExpModalTitle"
      style="background: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="newExpModalTitle">{{ t('expModal.title') }}</h4>
            <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">{{ t('expModal.modelLabel') }}</label>
                <select v-model="selectedModel" class="form-select" @change="autoFillName">
                  <option value="" disabled>{{ t('expModal.selectModel') }}</option>
                  <option v-for="model in models" :key="model.id" :value="model.name">
                    {{ model.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ t('expModal.nameLabel') }}</label>
                <input v-model="expName" type="text" class="form-control" :placeholder="t('expModal.namePlaceholder')">
                <div class="form-text">{{ t('expModal.nameHint') }}</div>
              </div>
              <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
              <div class="d-flex justify-content-between mt-3">
                <button type="button" class="btn btn-secondary" @click="close">{{ t('common.cancel') }}</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? t('expModal.creating') : t('expModal.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useLocale } from '../composables/useLocale'

const props = defineProps(['show', 'models'])
const emit = defineEmits(['close', 'created'])

const { getExperiments, createExperiment } = useApi()
const { currentUser } = useAuth()
const { t } = useLocale()

const selectedModel = ref('')
const expName = ref('')
const error = ref('')
const loading = ref(false)

function autoFillName() {
  if (selectedModel.value) {
    const dateStr = new Date().toLocaleDateString('ru-RU')
    expName.value = `${selectedModel.value}_${dateStr}`
  }
}

function close() {
  selectedModel.value = ''
  expName.value = ''
  error.value = ''
  emit('close')
}

watch(() => props.show, (val) => {
  if (!val) {
    selectedModel.value = ''
    expName.value = ''
    error.value = ''
  }
})

async function handleSubmit() {
  error.value = ''

  if (!selectedModel.value) {
    error.value = t('expModal.selectModelError')
    return
  }
  if (!expName.value.trim()) {
    error.value = t('expModal.nameError')
    return
  }

  loading.value = true
  try {
    const res = await getExperiments({ userId: currentUser.value.id })
    const isDuplicate = res.data.some(
      e => e.name.toLowerCase() === expName.value.trim().toLowerCase()
    )
    if (isDuplicate) {
      error.value = t('expModal.duplicateError')
      return
    }

    await createExperiment({
      name: expName.value.trim(),
      model: selectedModel.value,
      metricName: 'Accuracy',
      metricValue: parseFloat((Math.random() * 100).toFixed(2)),
      date: new Date().toLocaleString('ru-RU'),
      duration: '-',
      status: 'process',
      userId: currentUser.value.id,
    })

    emit('created')
    close()
  } catch {
    error.value = t('expModal.createError')
  } finally {
    loading.value = false
  }
}
</script>
