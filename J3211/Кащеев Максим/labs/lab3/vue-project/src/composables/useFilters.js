import { ref, computed } from 'vue'

export function useFilters(items, searchFields = ['title', 'description']) {
  const searchQuery = ref('')
  const activeCategory = ref('')

  const filtered = computed(() => {
    if (!items.value) return []
    let result = items.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => (item[field] || '').toLowerCase().includes(q))
      )
    }

    if (activeCategory.value && activeCategory.value !== 'all') {
      result = result.filter((item) => item.category === activeCategory.value)
    }

    return result
  })

  function setCategory(cat) {
    activeCategory.value = cat
  }

  function clearFilters() {
    searchQuery.value = ''
    activeCategory.value = ''
  }

  return { searchQuery, activeCategory, filtered, setCategory, clearFilters }
}
