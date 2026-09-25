<script setup>
import { ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import { modelsApi, datasetsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@/composables/useFileStore'

const props = defineProps({
  type: { type: String, default: 'models' } // 'models' | 'datasets'
})

const emit = defineEmits(['created'])
const authStore = useAuthStore()
const fileStore = useFileStore()

const modalEl = ref(null)
const formEl = ref(null)
const fileInput = ref(null)
const validated = ref(false)
const submitting = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const uploadError = ref('')

const isDataset = computed(() => props.type === 'datasets')

const defaultForm = () => isDataset.value
  ? { title: '', desc: '', task: 'nlp', format: 'json' }
  : { title: '', desc: '', task: 'nlp', framework: 'pytorch' }

const form = ref(defaultForm())

let modalInstance = null

function getModal() {
  if (!modalInstance) modalInstance = new Modal(modalEl.value)
  return modalInstance
}

function open() {
  form.value = defaultForm()
  validated.value = false
  selectedFile.value = null
  uploadError.value = ''
  getModal().show()
}

function close() {
  getModal().hide()
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    uploadError.value = ''
    // Автозаполнение названия если поле пустое
    if (!form.value.title) {
      form.value.title = file.name.replace(/\.[^.]+$/, '')
    }
  }
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) {
    selectedFile.value = file
    uploadError.value = ''
    if (!form.value.title) {
      form.value.title = file.name.replace(/\.[^.]+$/, '')
    }
  }
}

async function submit() {
  if (!formEl.value.checkValidity()) {
    validated.value = true
    return
  }
  submitting.value = true
  uploadError.value = ''
  try {
    const api = isDataset.value ? datasetsApi : modelsApi
    const res = await api.create({
      ...form.value,
      author: authStore.user.username,
      downloads: 0,
      stars: 0,
      size: selectedFile.value ? formatSize(selectedFile.value.size) : '0 MB',
      fileName: selectedFile.value?.name || null
    })
    if (selectedFile.value) {
      await fileStore.save(props.type, res.data.id, selectedFile.value)
    }
    close()
    emit('created')
  } catch (e) {
    uploadError.value = e.message || 'Не удалось сохранить'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <div
    ref="modalEl"
    class="modal fade"
    tabindex="-1"
    :aria-label="isDataset ? 'Создать датасет' : 'Создать модель'"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow-lg">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            {{ isDataset ? 'Загрузить датасет' : 'Загрузить модель' }}
          </h5>
          <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body px-4 pb-4">
          <form
            ref="formEl"
            @submit.prevent="submit"
            novalidate
            :class="{ 'was-validated': validated }"
          >
            <!-- Зона загрузки файла -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Файл</label>
              <div
                class="file-drop-zone"
                :class="{ 'dragging': isDragging }"
                @click="fileInput?.click()"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="onDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="d-none"
                  @change="onFileChange"
                />
                <div v-if="selectedFile" class="d-flex align-items-center justify-content-center gap-2">
                  <svg class="svg-icon text-success" aria-hidden="true">
                    <use href="/sprite.svg#icon-box"></use>
                  </svg>
                  <span class="fw-semibold small">{{ selectedFile.name }}</span>
                  <span class="text-muted small">{{ formatSize(selectedFile.size) }}</span>
                </div>
                <div v-else class="text-muted small">
                  <svg class="svg-icon mb-1" aria-hidden="true">
                    <use href="/sprite.svg#icon-download"></use>
                  </svg>
                  <div>Перетащите файл сюда или нажмите для выбора</div>
                </div>
              </div>
              <div v-if="uploadError" class="text-danger small mt-1">{{ uploadError }}</div>
            </div>

            <div class="mb-3">
              <label for="resTitle" class="form-label fw-semibold">Название</label>
              <input
                v-model="form.title"
                type="text"
                class="form-control"
                id="resTitle"
                required
                placeholder="Введите название..."
              >
              <div class="invalid-feedback">Введите название</div>
            </div>
            <div class="mb-3">
              <label for="resDesc" class="form-label fw-semibold">Описание</label>
              <textarea
                v-model="form.desc"
                class="form-control"
                id="resDesc"
                rows="3"
                required
                placeholder="Краткое описание..."
              ></textarea>
              <div class="invalid-feedback">Введите описание</div>
            </div>
            <div class="row g-3 mb-4">
              <div class="col-6">
                <label for="resTask" class="form-label fw-semibold">Задача</label>
                <select v-model="form.task" class="form-select" id="resTask">
                  <option value="nlp">NLP (Текст)</option>
                  <option value="cv">Computer Vision</option>
                  <option value="audio">Audio / Speech</option>
                </select>
              </div>
              <div class="col-6">
                <template v-if="isDataset">
                  <label for="resFormat" class="form-label fw-semibold">Формат</label>
                  <select v-model="form.format" class="form-select" id="resFormat">
                    <option value="json">JSON / JSONL</option>
                    <option value="csv">CSV / Parquet</option>
                    <option value="images">ZIP (Images)</option>
                  </select>
                </template>
                <template v-else>
                  <label for="resFramework" class="form-label fw-semibold">Фреймворк</label>
                  <select v-model="form.framework" class="form-select" id="resFramework">
                    <option value="pytorch">PyTorch</option>
                    <option value="tensorflow">TensorFlow</option>
                    <option value="jax">JAX</option>
                  </select>
                </template>
              </div>
            </div>
            <button
              type="submit"
              class="btn w-100 fw-semibold"
              :class="isDataset ? 'btn-success' : 'btn-primary'"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              {{ isDataset ? 'Опубликовать датасет' : 'Опубликовать модель' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
