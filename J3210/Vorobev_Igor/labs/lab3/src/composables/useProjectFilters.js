import { computed, ref } from 'vue'

export function useProjectFilters(projects) {
  const search = ref('')
  const status = ref('')
  const priority = ref('')
  const assignee = ref('')

  const assignees = computed(() => {
    const names = projects.value.flatMap((project) =>
      (project.teamDetails || []).map((member) => member.name).filter(Boolean),
    )
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'ru'))
  })

  const filteredProjects = computed(() => {
    const query = search.value.trim().toLowerCase()

    return projects.value.filter((project) => {
      const matchSearch = !query || project.name.toLowerCase().includes(query)
      const matchStatus = !status.value || project.status === status.value
      const matchPriority = !priority.value || project.priority === priority.value
      const matchAssignee =
        !assignee.value || (project.teamDetails || []).some((member) => member.name === assignee.value)

      return matchSearch && matchStatus && matchPriority && matchAssignee
    })
  })


  return {
    search,
    status,
    priority,
    assignee,
    assignees,
    filteredProjects,
  }
}
