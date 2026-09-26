<template>
  <AppLayout>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1">Проекты</h1>
        <p class="text-muted mb-0">Поиск, фильтрация и управление участием в проектах.</p>
      </div>
      <button class="btn btn-outline-black" type="button" data-bs-toggle="modal" data-bs-target="#createProjectModal">
        Создать проект
      </button>
    </div>

    <AppAlert :message="error" @close="error = ''" />

    <ProjectFilters
      v-model:search="search"
      v-model:status="status"
      v-model:priority="priority"
      v-model:assignee="assignee"
      :assignees="assignees"
    />

    <div v-if="loading" class="loading-state">Загрузка проектов...</div>

    <div v-else-if="filteredProjects.length" class="row g-4">
      <div v-for="project in filteredProjects" :key="project.id" class="col-12 col-md-6 col-xl-4">
        <ProjectCard
          :project="project"
          :role="getUserRole(project)"
          @open="openProject"
          @join="joinProject"
        />
      </div>
    </div>

    <div v-else class="empty-state">
      <h2 class="h5">Проекты не найдены</h2>
      <p class="text-muted mb-0">Измени параметры фильтрации или создай новый проект.</p>
    </div>

    <ProjectCreateModal ref="createModal" :loading="creating" @create="createProject" />
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppAlert from '@/components/AppAlert.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectFilters from '@/components/ProjectFilters.vue'
import ProjectCreateModal from '@/components/ProjectCreateModal.vue'
import { projectsApi } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useProjectFilters } from '@/composables/useProjectFilters'

const router = useRouter()
const { currentUser } = useAuth()
const projects = ref([])
const loading = ref(true)
const creating = ref(false)
const error = ref('')
const createModal = ref(null)

const {
  search,
  status,
  priority,
  assignee,
  assignees,
  filteredProjects,
} = useProjectFilters(projects)

function getUserRole(project) {
  const member = (project.teamDetails || []).find((item) => item.email === currentUser.value?.email)
  return member?.role || ''
}

function formatDeadline(value) {
  if (!value) return '--.--.----'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    projects.value = await projectsApi.getAll()
  } catch {
    error.value = 'Не удалось загрузить проекты. Проверь, что JSON Server запущен на порту 3001.'
  } finally {
    loading.value = false
  }
}

function openProject(id) {
  router.push({ name: 'project', params: { id } })
}

async function joinProject(id) {
  const project = projects.value.find((item) => String(item.id) === String(id))
  const user = currentUser.value
  if (!project || !user || getUserRole(project)) return

  const member = {
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: 'Наблюдатель',
  }
  const fullName = `${user.name} ${user.surname}`.trim()
  const teamDetails = [...(project.teamDetails || []), member]
  const team = [...new Set([...(project.team || []), fullName])]

  try {
    const updated = await projectsApi.update(id, { teamDetails, team })
    const index = projects.value.findIndex((item) => String(item.id) === String(id))
    projects.value[index] = updated
  } catch {
    error.value = 'Не удалось вступить в проект.'
  }
}

async function createProject(form) {
  const user = currentUser.value
  if (!user) return

  creating.value = true
  error.value = ''
  try {
    const created = await projectsApi.create({
      name: form.name,
      description: form.description || 'Без описания',
      status: form.status,
      priority: form.priority,
      deadline: formatDeadline(form.deadline),
      team: [`${user.name} ${user.surname}`.trim()],
      teamDetails: [
        {
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: 'Администратор',
        },
      ],
    })
    projects.value.push(created)
    createModal.value?.close()
  } catch {
    error.value = 'Не удалось создать проект.'
  } finally {
    creating.value = false
  }
}

onMounted(loadProjects)
</script>
