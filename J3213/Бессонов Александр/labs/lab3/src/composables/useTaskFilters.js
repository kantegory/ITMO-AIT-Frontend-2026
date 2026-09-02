import { computed, ref, toValue } from 'vue'

export function useTaskFilters(tasks) {
  const searchQuery = ref('')

  const filteredTasks = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')
    if (!query) return toValue(tasks)

    return toValue(tasks).filter((task) =>
      [task.title, task.project, task.priority]
        .join(' ')
        .toLocaleLowerCase('ru-RU')
        .includes(query),
    )
  })

  function resetSearch() {
    searchQuery.value = ''
  }

  return { searchQuery, filteredTasks, resetSearch }
}
