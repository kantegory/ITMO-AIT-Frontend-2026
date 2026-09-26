<template>
  <AppLayout>
    <RouterLink class="back-link mb-4" to="/projects">← К проектам</RouterLink>

    <AppAlert :message="error" @close="error = ''" />

    <div v-if="loading" class="loading-state">Загрузка проекта...</div>

    <template v-else-if="project">
      <section class="info-card project-summary">
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <p class="eyebrow mb-2">Проект #{{ project.id }}</p>
            <h1 class="h2 fw-bold mb-3">{{ project.name }}</h1>
            <p class="mb-0">{{ project.description || 'Описание не указано' }}</p>
          </div>
          <div class="project-meta">
            <span class="badge">{{ project.status }}</span>
            <span class="badge">{{ project.priority }}</span>
            <span class="deadline">Дедлайн: <strong>{{ project.deadline || '--.--.----' }}</strong></span>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <div class="col-12 col-lg-5">
          <TeamList
            :team="project.teamDetails || []"
            :is-admin="isAdmin"
            @invite="inviteMember"
            @change-role="changeRole"
            @remove="removeMember"
          />
        </div>

        <div class="col-12 col-lg-7">
          <section class="info-card h-100">
            <div class="pos-tabs" role="tablist" aria-label="Разделы проекта">
              <button class="pos-tab" :class="{ active: activeTab === 'files' }" type="button" @click="activeTab = 'files'">Файлы</button>
              <button class="pos-tab" :class="{ active: activeTab === 'comments' }" type="button" @click="activeTab = 'comments'">Комментарии</button>
            </div>

            <ProjectFiles
              v-if="activeTab === 'files'"
              :files="files"
              @add="addFile"
              @delete="deleteFile"
            />
            <ProjectComments
              v-else
              :comments="comments"
              @send="sendComment"
            />
          </section>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <h1 class="h4">Проект не найден</h1>
      <RouterLink class="btn btn-outline-black mt-3" to="/projects">Вернуться к проектам</RouterLink>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppAlert from '@/components/AppAlert.vue'
import TeamList from '@/components/TeamList.vue'
import ProjectFiles from '@/components/ProjectFiles.vue'
import ProjectComments from '@/components/ProjectComments.vue'
import { commentsApi, filesApi, projectsApi, usersApi } from '@/api'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { currentUser } = useAuth()

const project = ref(null)
const files = ref([])
const comments = ref([])
const loading = ref(true)
const error = ref('')
const activeTab = ref('files')

const projectId = computed(() => route.params.id)
const myRole = computed(() => {
  const member = (project.value?.teamDetails || []).find((item) => item.email === currentUser.value?.email)
  return member?.role || ''
})
const isAdmin = computed(() => myRole.value === 'Администратор')

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    const [projectData, projectFiles, projectComments] = await Promise.all([
      projectsApi.getById(projectId.value),
      filesApi.getByProject(projectId.value),
      commentsApi.getByProject(projectId.value),
    ])
    project.value = projectData
    files.value = projectFiles
    comments.value = projectComments
  } catch {
    project.value = null
    error.value = 'Не удалось загрузить данные проекта.'
  } finally {
    loading.value = false
  }
}

async function inviteMember(email) {
  if (!isAdmin.value) return
  error.value = ''
  try {
    const users = await usersApi.findByEmail(email.toLowerCase())
    if (!users.length) throw new Error('Пользователь с таким Email не найден')
    const target = users[0]
    if ((project.value.teamDetails || []).some((member) => member.email === target.email)) {
      throw new Error('Этот пользователь уже в команде')
    }

    const member = {
      name: target.name,
      surname: target.surname,
      email: target.email,
      role: 'Участник',
    }
    const fullName = `${target.name} ${target.surname}`.trim()
    await saveTeam([...(project.value.teamDetails || []), member], [...new Set([...(project.value.team || []), fullName])])
  } catch (err) {
    error.value = err.message
  }
}

async function changeRole(member, newRole) {
  if (!isAdmin.value) return
  const teamDetails = (project.value.teamDetails || []).map((item) =>
    item.email === member.email ? { ...item, role: newRole } : item,
  )
  await saveTeam(teamDetails, project.value.team || [])
}

async function removeMember(member) {
  if (!isAdmin.value) return
  if (!window.confirm(`Удалить ${member.name} ${member.surname || ''} из проекта?`)) return

  const teamDetails = (project.value.teamDetails || []).filter((item) => item.email !== member.email)
  const fullName = `${member.name} ${member.surname}`.trim()
  const team = (project.value.team || []).filter((name) => name !== fullName)
  await saveTeam(teamDetails, team)
}

async function saveTeam(teamDetails, team) {
  error.value = ''
  try {
    project.value = await projectsApi.update(projectId.value, { teamDetails, team })
  } catch {
    error.value = 'Не удалось обновить состав команды.'
  }
}

async function addFile(name) {
  error.value = ''
  try {
    const created = await filesApi.create({
      projectId: Number(projectId.value),
      name,
      size: '1.0 MB',
      date: new Date().toLocaleDateString('ru-RU'),
    })
    files.value.unshift(created)
  } catch {
    error.value = 'Не удалось добавить файл.'
  }
}

async function deleteFile(id) {
  if (!window.confirm('Удалить этот файл?')) return
  error.value = ''
  try {
    await filesApi.remove(id)
    files.value = files.value.filter((file) => file.id !== id)
  } catch {
    error.value = 'Не удалось удалить файл.'
  }
}

async function sendComment(text) {
  error.value = ''
  try {
    const user = currentUser.value
    const created = await commentsApi.create({
      projectId: Number(projectId.value),
      author: `${user.name} ${user.surname || ''}`.trim() || user.email,
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    })
    comments.value.push(created)
  } catch {
    error.value = 'Не удалось отправить комментарий.'
  }
}

onMounted(loadProject)
watch(projectId, loadProject)
</script>
