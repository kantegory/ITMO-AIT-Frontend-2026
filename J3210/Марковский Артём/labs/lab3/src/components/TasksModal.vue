<script setup>
import { ref, computed } from 'vue'
import { useProjects } from '@/composables/useProjects.js'
import { useDateMask } from '@/composables/useDateMask.js'
import { getUserName } from '@/stores/auth.js'

const props = defineProps({ project: Object })

const { updateProject } = useProjects()
const { onDateBlur, normalizeDateInput, isValidDateString } = useDateMask()

const newTaskTitle = ref('')
const newTaskStatus = ref('Новая')
const newTaskPriority = ref('Высокий')
const newTaskAssignee = ref('Без исполнителя')
const newTaskDue = ref('')
const newTaskDueRef = ref(null)

const memberNames = computed(() => {
  const names = ['Без исполнителя', ...props.project.members.map((m) => m.name)]
  return names.filter((n, i, a) => a.indexOf(n) === i)
})

function handleDueInput(e) {
  const norm = normalizeDateInput(e.target.value)
  e.target.value = norm
  e.target.setCustomValidity('')
}

function handleNewDueInput(e) {
  const norm = normalizeDateInput(e.target.value)
  e.target.value = norm
  newTaskDue.value = norm
  e.target.setCustomValidity('')
}

function changeTaskTitle(index, value) {
  const v = value.trim()
  if (!v) return
  updateProject(props.project.id, (p) => {
    if (p.tasks[index]) p.tasks[index].title = v.slice(0, 80)
  })
}

function changeTaskStatus(index, value) {
  updateProject(props.project.id, (p) => {
    const task = p.tasks[index]
    if (!task) return
    if (p.role === 'Участник' && task.assignee !== getUserName()) return
    task.status = value
  })
}

function changeTaskPriority(index, value) {
  updateProject(props.project.id, (p) => {
    if (p.tasks[index]) p.tasks[index].priority = value
  })
}

function changeTaskAssignee(index, value) {
  updateProject(props.project.id, (p) => {
    if (p.tasks[index]) p.tasks[index].assignee = value
  })
}

function changeTaskDue(index, e) {
  const value = normalizeDateInput(e.target.value)
  e.target.value = value
  e.target.setCustomValidity(isValidDateString(value) ? '' : 'Дата в формате ДД.ММ.ГГГГ')
  if (!isValidDateString(value)) {
    e.target.reportValidity()
    return
  }
  updateProject(props.project.id, (p) => {
    if (p.tasks[index]) p.tasks[index].due = value
  })
}

function removeTask(index) {
  updateProject(props.project.id, (p) => {
    p.tasks.splice(index, 1)
  })
}

function takeTask(index) {
  updateProject(props.project.id, (p) => {
    const task = p.tasks[index]
    if (!task || task.assignee !== 'Без исполнителя') return
    task.assignee = getUserName()
    if (task.status === 'Новая') task.status = 'В работе'
  })
}

function addTask() {
  const title = newTaskTitle.value.trim()
  const due = normalizeDateInput(newTaskDue.value)

  if (!title || !isValidDateString(due)) {
    if (newTaskDueRef.value) {
      newTaskDueRef.value.setCustomValidity(isValidDateString(due) ? '' : 'Дата в формате ДД.ММ.ГГГГ')
      newTaskDueRef.value.reportValidity()
    }
    return
  }

  updateProject(props.project.id, (p) => {
    p.tasks.push({
      title: title.slice(0, 80),
      status: newTaskStatus.value,
      priority: newTaskPriority.value,
      assignee: newTaskAssignee.value,
      due,
    })
  })

  newTaskTitle.value = ''
  newTaskDue.value = ''
}
</script>

<template>
  <div class="modal-editor-list">
    <template v-if="project.role === 'Участник'">
      <div class="modal-editor-card">
        <div class="modal-section-title">Мои задачи и свободные карточки</div>
        <div class="modal-caption mb-3">Участник может взять свободную задачу и менять статус только у своих карточек.</div>
        <div v-for="(task, i) in project.tasks" :key="i" class="modal-task-card">
          <div class="modal-grid modal-grid-member-task">
            <div class="modal-task-summary">
              <div class="fw-bold text-wrap-anywhere">{{ task.title }}</div>
              <div class="modal-caption text-wrap-anywhere">{{ task.assignee }} · {{ task.priority }} приоритет · {{ task.due }}</div>
            </div>
            <select
              class="form-select"
              :value="task.status"
              :disabled="task.assignee !== getUserName()"
              @change="(e) => changeTaskStatus(i, e.target.value)"
            >
              <option value="Новая">Новая</option>
              <option value="В работе">В работе</option>
              <option value="На проверке">На проверке</option>
              <option value="Завершено">Завершено</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              :disabled="task.assignee !== 'Без исполнителя'"
              @click="takeTask(i)"
            >Взять задачу</button>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="modal-editor-card">
        <div class="modal-section-title">Карточки задач</div>
        <div v-for="(task, i) in project.tasks" :key="i" class="modal-task-card">
          <div class="modal-grid modal-grid-tasks">
            <input
              class="form-control"
              type="text"
              maxlength="80"
              :value="task.title"
              @change="(e) => changeTaskTitle(i, e.target.value)"
            />
            <select class="form-select" :value="task.status" @change="(e) => changeTaskStatus(i, e.target.value)">
              <option value="Новая">Новая</option>
              <option value="В работе">В работе</option>
              <option value="На проверке">На проверке</option>
              <option value="Завершено">Завершено</option>
            </select>
            <select class="form-select" :value="task.priority" @change="(e) => changeTaskPriority(i, e.target.value)">
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
            <select class="form-select" :value="task.assignee" @change="(e) => changeTaskAssignee(i, e.target.value)">
              <option v-for="name in memberNames" :key="name" :value="name">{{ name }}</option>
            </select>
            <input
              class="form-control"
              type="text"
              inputmode="numeric"
              maxlength="10"
              :value="task.due"
              @input="handleDueInput"
              @change="(e) => changeTaskDue(i, e)"
              @blur="onDateBlur"
            />
            <button class="btn btn-light" type="button" @click="removeTask(i)">Удалить</button>
          </div>
        </div>
      </div>
      <div class="modal-editor-card">
        <div class="modal-section-title">Добавить задачу</div>
        <div class="modal-grid modal-grid-tasks-add">
          <input
            class="form-control"
            id="newTaskTitle"
            type="text"
            maxlength="80"
            placeholder="Название задачи"
            v-model="newTaskTitle"
          />
          <select class="form-select" v-model="newTaskStatus">
            <option value="Новая">Новая</option>
            <option value="В работе">В работе</option>
            <option value="На проверке">На проверке</option>
            <option value="Завершено">Завершено</option>
          </select>
          <select class="form-select" v-model="newTaskPriority">
            <option value="Высокий">Высокий</option>
            <option value="Средний">Средний</option>
            <option value="Низкий">Низкий</option>
          </select>
          <select class="form-select" v-model="newTaskAssignee">
            <option v-for="name in memberNames" :key="name" :value="name">{{ name }}</option>
          </select>
          <input
            class="form-control"
            id="newTaskDue"
            type="text"
            inputmode="numeric"
            maxlength="10"
            placeholder="01.01.1999"
            :value="newTaskDue"
            ref="newTaskDueRef"
            @input="handleNewDueInput"
            @blur="onDateBlur"
          />
          <button class="btn btn-primary" type="button" @click="addTask">Добавить</button>
        </div>
      </div>
    </template>
  </div>
</template>
