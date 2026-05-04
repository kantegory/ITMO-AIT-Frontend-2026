<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newModelModalTitle"
      style="background: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newModelModalTitle">Регистрация новой модели</h5>
            <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Название модели</label>
                <input v-model="modelName" type="text" class="form-control" placeholder="Например, CV_model">
              </div>
              <div class="mb-3">
                <label class="form-label">Библиотека / Фреймворк</label>
                <select v-model="framework" class="form-select">
                  <option value="" disabled>Выберите библиотеку...</option>
                  <option value="pytorch">PyTorch</option>
                  <option value="tensorflow">TensorFlow</option>
                  <option value="sklearn">Scikit-learn</option>
                  <option value="onnx">ONNX</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Путь к артефактам</label>
                <input v-model="artifactPath" type="text" class="form-control">
                <div class="form-text">Укажите путь к хранилищу весов модели.</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Начальная стадия</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" v-model="stage" value="none" id="stageNone">
                    <label class="form-check-label" for="stageNone">None</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" v-model="stage" value="staging" id="stageStaging">
                    <label class="form-check-label" for="stageStaging">Staging</label>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea v-model="description" class="form-control" rows="2"></textarea>
              </div>
              <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
              <div class="d-flex justify-content-between mt-3">
                <button type="button" class="btn btn-secondary" @click="close">Отмена</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Сохранение...' : 'Зарегистрировать' }}
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
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

defineProps(['show'])
const emit = defineEmits(['close', 'created'])

const { createModel, getModels } = useApi()
const { currentUser } = useAuth()

const modelName = ref('')
const framework = ref('')
const artifactPath = ref('')
const stage = ref('none')
const description = ref('')
const error = ref('')
const loading = ref(false)

function close() {
  modelName.value = ''
  framework.value = ''
  artifactPath.value = ''
  stage.value = 'none'
  description.value = ''
  error.value = ''
  emit('close')
}

async function handleSubmit() {
  error.value = ''

  if (!modelName.value.trim()) {
    error.value = 'Введите название модели!'
    return
  }
  if (!framework.value) {
    error.value = 'Выберите фреймворк!'
    return
  }

  loading.value = true
  try {
    const res = await getModels({ userId: currentUser.value.id })
    const isDuplicate = res.data.some(
      m => m.name.toLowerCase() === modelName.value.trim().toLowerCase()
    )
    if (isDuplicate) {
      error.value = 'Модель с таким названием уже существует!'
      return
    }

    await createModel({
      name: modelName.value.trim(),
      framework: framework.value,
      artifactPath: artifactPath.value,
      stage: stage.value,
      description: description.value,
      date: new Date().toLocaleDateString('ru-RU'),
      userId: currentUser.value.id,
    })

    emit('created')
    close()
  } catch {
    error.value = 'Ошибка при создании модели'
  } finally {
    loading.value = false
  }
}
</script>
