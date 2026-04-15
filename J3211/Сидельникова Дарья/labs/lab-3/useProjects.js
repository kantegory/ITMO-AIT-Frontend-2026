import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'

export function useProjects() {
  const projectsStore = useProjectsStore()
  const authStore = useAuthStore()

  const accessibleProjects = computed(() => {
    const userId = authStore.user?.id

    if (!userId) return []

    return projectsStore.projects.filter(project => {
      const isOwner = String(project.ownerId) === String(userId)
      const isTeamMember =
        Array.isArray(project.team) &&
        project.team.some(member => String(member.id) === String(userId))

      return isOwner || isTeamMember
    })
  })

  return {
    projects: computed(() => projectsStore.projects),
    currentProject: computed(() => projectsStore.currentProject),
    loading: computed(() => projectsStore.loading),
    error: computed(() => projectsStore.error),
    accessibleProjects,
    fetchProjects: projectsStore.fetchProjects,
    fetchProjectById: projectsStore.fetchProjectById,
    addProject: projectsStore.addProject
  }
}