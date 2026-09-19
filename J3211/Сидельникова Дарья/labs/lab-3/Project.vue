<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useProjects } from '@/composables/useProjects'
import { useTasks } from '@/composables/useTasks'

const route = useRoute()
const { currentProject, fetchProjectById } = useProjects()
const { projectTasks, fetchProjectTasks } = useTasks()

const teamMembers = computed(() => {
  const project = currentProject.value
  if (!project) return []

  const team = Array.isArray(project.team) ? [...project.team] : []

  const ownerAlreadyInTeam = team.some(
    member => String(member.id) === String(project.ownerId)
  )

  if (!ownerAlreadyInTeam && project.ownerId) {
    team.unshift({
      id: project.ownerId,
      name: project.ownerName || 'Project owner'
    })
  }

  return team
})

onMounted(async () => {
  const projectId = route.params.id
  await fetchProjectById(projectId)
  await fetchProjectTasks(projectId)
})
</script>

<template>
  <DefaultLayout>
    <div v-if="currentProject">
      <h1 id="projectTitle" class="mb-3">{{ currentProject.name }}</h1>
      <p id="projectDescription" class="mb-4">{{ currentProject.description || '' }}</p>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card p-3">
            <h4 class="mb-3">Team</h4>
            <ul id="projectTeam" class="list-group">
              <li
                v-for="member in teamMembers"
                :key="member.id"
                class="list-group-item"
              >
                {{ member.name }}
                <span v-if="String(member.id) === String(currentProject.ownerId)"> (Owner)</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-md-8 mb-4">
          <div class="card p-3">
            <h4 class="mb-3">Tasks</h4>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Assignee</th>
                    <th>Creator</th>
                    <th>Status</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody id="userTasks">
                  <tr v-for="task in projectTasks" :key="task.id">
                    <td>{{ task.title }}</td>
                    <td>{{ task.project }}</td>
                    <td>{{ task.assigneeName || '-' }}</td>
                    <td>{{ task.creatorName || '-' }}</td>
                    <td>{{ task.status }}</td>
                    <td>{{ task.due || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>