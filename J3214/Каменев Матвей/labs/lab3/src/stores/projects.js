import { ref } from 'vue'
import { defineStore } from 'pinia'
import { projectsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

export const useProjectsStore = defineStore('projects', () => {
  const auth = useAuthStore()

  const projects = ref([])
  const currentProject = ref(null)

  async function loadProjects() {
    const response = await projectsApi.getMy(auth.user.id)

    projects.value = response.data
  }

  async function loadProject(id) {
    currentProject.value = null

    const response = await projectsApi.getMyById(auth.user.id, id)

    currentProject.value = response.data[0] || null
  }

  return { projects, currentProject, loadProjects, loadProject }
})
