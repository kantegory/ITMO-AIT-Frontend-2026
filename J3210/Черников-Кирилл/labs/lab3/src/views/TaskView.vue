<template>
  <main id="main-content" role="main" class="container py-4 py-lg-5" tabindex="-1">
    <section class="hero p-4 p-lg-5 mb-4 fade-up">
      <div class="d-flex flex-wrap justify-content-between gap-3">
        <div>
          <p class="badge badge-soft rounded-pill mb-2">Страница задачи аннотации</p>
          <h1 class="display-6 fw-bold mb-2">{{ task?.title || 'Загрузка задачи...' }}</h1>
          <p class="text-secondary mb-0" role="status" aria-live="polite">{{ task?.instruction || 'Получаем данные из API.' }}</p>
        </div>
        <div class="align-self-center">
          <button type="button" class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#submitTaskModal" :disabled="!task">
            Отправить на проверку
          </button>
        </div>
      </div>
    </section>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else class="row g-4">
      <div class="col-lg-8">
        <article class="task-card p-4 mb-4">
          <div class="d-flex flex-wrap gap-2 mb-3" role="toolbar" aria-label="Инструменты аннотации">
            <button
              v-for="(tool, index) in task?.annotationTools ?? []"
              :key="tool"
              type="button"
              class="btn btn-outline-brand"
              :class="{ active: activeTool === tool }"
              :aria-pressed="activeTool === tool ? 'true' : 'false'"
              :aria-label="`Инструмент: ${tool}`"
              @click="activeTool = tool"
            >
              {{ tool }}
            </button>
          </div>
          <p class="text-secondary">Активный инструмент: <strong aria-live="polite">{{ activeTool || 'Не выбран' }}</strong></p>
          <div
            class="annotation-canvas d-flex align-items-center justify-content-center text-secondary"
            role="region"
            aria-label="Область аннотации"
          >
            {{ canvasText }}
          </div>
        </article>

        <article class="glass-card p-4">
          <h2 class="h5 mb-3">Файлы задачи</h2>
          <ul class="list-group" aria-live="polite">
            <li v-if="!task" class="list-group-item text-secondary">Загрузка файлов...</li>
            <li
              v-for="file in task?.files ?? []"
              :key="file.name"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ file.name }}
              <span class="badge text-bg-secondary">{{ file.size }}</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="col-lg-4">
        <article class="glass-card p-4 h-100">
          <h2 class="h5 mb-3">Инструкции</h2>
          <ol class="text-secondary ps-3">
            <li v-if="!task" class="mb-2">Загрузка инструкций...</li>
            <li v-for="step in task?.instructions ?? []" :key="step" class="mb-2">{{ step }}</li>
          </ol>
          <hr />
          <h3 class="h6">Статус</h3>
          <p class="mb-2">Исполнитель: <strong>{{ task?.assignee ?? '-' }}</strong></p>
          <p class="mb-2">Прогресс: <strong>{{ task ? `${task.progressCompleted}/${task.progressTotal} кадров` : '-' }}</strong></p>
          <p class="mb-0">Срок: <strong>{{ task?.dueDate ?? '-' }}</strong></p>
        </article>
      </div>
    </div>
  </main>

  <div class="modal fade" id="submitTaskModal" tabindex="-1" aria-labelledby="submitTaskTitle" aria-describedby="submit-task-text" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="submitTaskTitle" class="modal-title fs-5">Подтвердить отправку</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div id="submit-task-text" class="modal-body">{{ submitText }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
          <button
            id="confirm-submit-task"
            type="button"
            class="btn btn-brand"
            :disabled="submitLoading || submitDone"
            :aria-busy="submitLoading ? 'true' : 'false'"
            @click="submitTask"
          >
            {{ submitDone ? 'Отправлено' : submitLoading ? 'Отправляем...' : 'Подтвердить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import { useApi } from '../composables/useApi'

const route = useRoute()
const { get, patch } = useApi()

const task = ref(null)
const project = ref(null)
const error = ref('')
const activeTool = ref('')
const submitLoading = ref(false)
const submitDone = ref(false)
const submitText = ref('Задача будет передана валидатору. После отправки редактирование блокируется.')

const canvasText = computed(() => {
  if (!project.value) return 'Viewer area: изображение/видео для аннотации'
  return `Viewer area: данные для проекта "${project.value.dashboardTitle}" загружены из API.`
})

onMounted(async () => {
  const id = Number.parseInt(route.params.id, 10) || 1
  try {
    const t = await get(`/tasks/${id}`)
    const p = await get(`/projects/${t.projectId}`)
    task.value = t
    project.value = p
    activeTool.value = t.annotationTools[0] || ''

    if (t.status === 'review') {
      submitText.value = 'Задача уже находится на проверке.'
      submitDone.value = true
    }
  } catch (err) {
    error.value = err.message
  }
})

async function submitTask() {
  if (!task.value || !project.value) return
  submitLoading.value = true
  try {
    await Promise.all([
      patch(`/tasks/${task.value.id}`, { status: 'review' }),
      patch(`/projects/${project.value.id}`, {
        status: 'review',
        statusLabel: 'На проверке',
        statusVariant: 'success',
      }),
    ])
    submitText.value = 'Задача успешно передана валидатору. Статус обновлён в моковом API.'
    submitDone.value = true
    setTimeout(() => {
      Modal.getInstance(document.getElementById('submitTaskModal'))?.hide()
    }, 900)
  } catch (err) {
    submitText.value = err.message
  } finally {
    submitLoading.value = false
  }
}
</script>
