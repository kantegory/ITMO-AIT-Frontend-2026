<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'
import { useTasks } from '@/composables/useTasks'

const router = useRouter()
const { user } = useAuth()
const { accessibleProjects, fetchProjects } = useProjects()
const { addTask } = useTasks()

const form = reactive({
  title: '',
  description: '',
  projectId: '',
  assigneeId: '',
  status: 'To Do',
  due: ''
})

const availableMembers = ref([])

const selectedProject = computed(() =>
  accessibleProjects.value.find((project) => String(project.id) === String(form.projectId))
)

watch(
  () => form.projectId,
  () => {
    form.assigneeId = ''

    if (!selectedProject.value || !Array.isArray(selectedProject.value.team)) {
      availableMembers.value = []
      return
    }

    const teamMembers = [...selectedProject.value.team]

    const ownerAlreadyInTeam = teamMembers.some(
      (member) => String(member.id) === String(selectedProject.value.ownerId)
    )

    if (!ownerAlreadyInTeam && selectedProject.value.ownerId) {
      teamMembers.unshift({
        id: selectedProject.value.ownerId,
        name: selectedProject.value.ownerName || 'Project owner'
      })
    }

    availableMembers.value = teamMembers
  }
)

onMounted(async () => {
  await fetchProjects()
})

async function handleSubmit() {
  if (!user.value) {
    alert('Сначала войдите в аккаунт')
    router.push('/login')
    return
  }

  if (!form.title.trim()) {
    alert('Введите название задачи')
    return
  }

  if (!form.projectId) {
    alert('Выберите проект')
    return
  }

  if (!form.assigneeId) {
    alert('Выберите участника')
    return
  }

  if (!form.due) {
    alert('Выберите дедлайн')
    return
  }

  const assignee = availableMembers.value.find(
    (member) => String(member.id) === String(form.assigneeId)
  )

  try {
    await addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      project: selectedProject.value ? selectedProject.value.name : '',
      projectId: form.projectId,
      assigneeId: form.assigneeId,
      assigneeName: assignee?.name || '',
      creatorId: user.value.id,
      creatorName: user.value.name,
      status: form.status,
      due: form.due
    })

    alert('Задача успешно создана')
    router.push('/dashboard')
  } catch (error) {
    alert(error.message || 'Ошибка при создании задачи')
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="container">
      <div class="card p-4">
        <h1 class="mb-4">Create new task</h1>

        <div class="mb-3">
          <label for="taskTitle" class="form-label">Task title</label>
          <input id="taskTitle" v-model="form.title" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="taskDescription" class="form-label">Description</label>
          <textarea id="taskDescription" v-model="form.description" rows="4" class="form-control"></textarea>
        </div>

        <div class="mb-3">
          <label for="taskProject" class="form-label">Project</label>
          <select id="taskProject" v-model="form.projectId" class="form-select">
            <option value="">Select project</option>
            <option
              v-for="project in accessibleProjects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="taskAssignee" class="form-label">Participant</label>
          <select id="taskAssignee" v-model="form.assigneeId" class="form-select">
            <option value="">Select participant</option>
            <option
              v-for="member in availableMembers"
              :key="member.id"
              :value="member.id"
            >
              {{ member.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="taskStatus" class="form-label">Status</label>
          <select id="taskStatus" v-model="form.status" class="form-select">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="taskDue" class="form-label">Due date</label>
          <input id="taskDue" v-model="form.due" type="date" class="form-control" />
        </div>

        <button id="createTaskBtn" class="btn btn-dark" @click="handleSubmit">
          Create task
        </button>
      </div>
    </div>
  </DefaultLayout>
</template>