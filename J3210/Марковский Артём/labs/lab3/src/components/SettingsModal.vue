<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects.js'
import { useDateMask } from '@/composables/useDateMask.js'

const props = defineProps({ project: Object })
const emit = defineEmits(['close'])

const router = useRouter()
const { updateProject, deleteProject } = useProjects()
const { onDateBlur, normalizeDateInput, isValidDateString } = useDateMask()

const title = ref(props.project.title)
const description = ref(props.project.description)
const status = ref(props.project.status)
const deadline = ref(props.project.deadline)
const deadlineRef = ref(null)

watch(
  () => props.project,
  (p) => {
    title.value = p.title
    description.value = p.description
    status.value = p.status
    deadline.value = p.deadline
  },
)

function handleDeadlineInput(e) {
  const norm = normalizeDateInput(e.target.value)
  e.target.value = norm
  deadline.value = norm
  e.target.setCustomValidity('')
}

function save() {
  const d = normalizeDateInput(deadline.value)
  if (deadlineRef.value) {
    deadlineRef.value.setCustomValidity(isValidDateString(d) ? '' : 'Дата в формате ДД.ММ.ГГГГ')
    if (!isValidDateString(d)) {
      deadlineRef.value.reportValidity()
      return
    }
  }

  updateProject(props.project.id, (p) => {
    p.title = (title.value.trim().slice(0, 60)) || p.title
    p.description = (description.value.trim().slice(0, 260)) || p.description
    p.status = status.value
    p.deadline = d
  })
}

function remove() {
  deleteProject(props.project.id)
  emit('close')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <form class="modal-editor-list" @submit.prevent="save">
    <div class="modal-editor-card">
      <div class="modal-section-title">Основные настройки</div>
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label" for="settingsTitle">Название</label>
          <input
            class="form-control"
            id="settingsTitle"
            type="text"
            maxlength="60"
            v-model="title"
          />
        </div>
        <div class="col-12">
          <label class="form-label" for="settingsDescription">Описание</label>
          <textarea
            class="form-control modal-textarea"
            id="settingsDescription"
            maxlength="260"
            v-model="description"
          ></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="settingsStatus">Статус</label>
          <select class="form-select" id="settingsStatus" v-model="status">
            <option value="Активный проект">Активный проект</option>
            <option value="Планирование">Планирование</option>
            <option value="На согласовании">На согласовании</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="settingsDeadline">Срок завершения</label>
          <input
            class="form-control"
            id="settingsDeadline"
            type="text"
            inputmode="numeric"
            maxlength="10"
            :value="deadline"
            ref="deadlineRef"
            @input="handleDeadlineInput"
            @blur="onDateBlur"
          />
        </div>
      </div>
    </div>
    <div class="modal-settings-actions">
      <button class="btn btn-primary" type="submit">Сохранить изменения</button>
      <button class="btn btn-light modal-danger-button" type="button" @click="remove">Удалить проект</button>
    </div>
  </form>
</template>
