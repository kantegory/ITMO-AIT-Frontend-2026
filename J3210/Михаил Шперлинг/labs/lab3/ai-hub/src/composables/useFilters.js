import { ref, computed } from 'vue'

export function useFilters(items) {
  const search = ref('')
  const activeTasks = ref([])
  const selectedFramework = ref('all')
  const selectedFormat = ref('all')

  const filtered = computed(() => {
    const q = search.value.toLowerCase().trim()
    return items.value.filter(item => {
      const matchesText = !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      const matchesTask = activeTasks.value.length === 0 ||
        activeTasks.value.includes(item.task)
      const matchesFramework = selectedFramework.value === 'all' ||
        selectedFramework.value === item.framework
      const matchesFormat = selectedFormat.value === 'all' ||
        selectedFormat.value === item.format
      return matchesText && matchesTask && matchesFramework && matchesFormat
    })
  })

  return { search, activeTasks, selectedFramework, selectedFormat, filtered }
}
