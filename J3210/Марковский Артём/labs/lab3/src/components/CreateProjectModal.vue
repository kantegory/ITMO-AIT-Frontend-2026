<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects.js'
import { useDateMask } from '@/composables/useDateMask.js'
import { getUserName } from '@/stores/auth.js'

const emit = defineEmits(['close'])
const router = useRouter()
const { createProject } = useProjects()
const { onDateBlur, normalizeDateInput, isValidDateString } = useDateMask()

const title = ref('')
const description = ref('')
const deadline = ref('')
const status = ref('Активный проект')
const titleRef = ref(null)
const deadlineRef = ref(null)

function handleDeadlineInput(e) {
  const norm = normalizeDateInput(e.target.value)
  e.target.value = norm
  deadline.value = norm
  e.target.setCustomValidity('')
}

async function submit() {
  const t = title.value.trim()
  const d = normalizeDateInput(deadline.value)

  if (titleRef.value) titleRef.value.setCustomValidity(t ? '' : 'Укажите название проекта')
  if (deadlineRef.value) deadlineRef.value.setCustomValidity(isValidDateString(d) ? '' : 'Дата в формате ДД.ММ.ГГГГ')

  if (!t || !isValidDateString(d)) {
    if (!t) titleRef.value?.reportValidity()
    else deadlineRef.value?.reportValidity()
    return
  }

  const projectId = `project-${Date.now()}`
  const currentUser = getUserName()

  await createProject({
    id: projectId,
    title: t.slice(0, 60),
    description: (description.value.trim() || 'Новый проект без описания.').slice(0, 260),
    status: status.value,
    deadline: d,
    members: [{ name: currentUser, role: 'Администратор' }],
    tasks: [],
    deadlines: [{ stage: 'Старт проекта', date: d, owner: currentUser }],
    files: [],
    discussion: [],
  })

  emit('close')
  router.push({ name: 'project', params: { id: projectId } })
}
</script>

<template>
  <form class="modal-editor-list" @submit.prevent="submit">
    <div class="modal-editor-card">
      <div class="modal-section-title">Основные данные проекта</div>
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label" for="createProjectTitle">Название</label>
          <input
            class="form-control"
            id="createProjectTitle"
            type="text"
            maxlength="60"
            placeholder="Название проекта"
            v-model="title"
            ref="titleRef"
          />
        </div>
        <div class="col-12">
          <label class="form-label" for="createProjectDescription">Описание</label>
          <textarea
            class="form-control modal-textarea"
            id="createProjectDescription"
            maxlength="260"
            placeholder="Краткое описание проекта"
            v-model="description"
          ></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="createProjectDeadline">Срок завершения</label>
          <input
            class="form-control"
            id="createProjectDeadline"
            type="text"
            inputmode="numeric"
            maxlength="10"
            placeholder="01.01.1999"
            :value="deadline"
            ref="deadlineRef"
            @input="handleDeadlineInput"
            @blur="onDateBlur"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="createProjectStatus">Статус</label>
          <select class="form-select" id="createProjectStatus" v-model="status">
            <option value="Планирование">Планирование</option>
            <option value="Активный проект">Активный проект</option>
            <option value="На согласовании">На согласовании</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-settings-actions">
      <button class="btn btn-primary" type="submit">Создать проект</button>
    </div>
  </form>
</template>
