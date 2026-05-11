import { computed, ref } from 'vue'
import { hubApi } from '@/services/api'

export function useHubSearch() {
  const query = ref('transformers')
  const type = ref('all')
  const sortKey = ref('downloads')
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const statusText = ref('Введите запрос или нажмите «Найти», чтобы получить данные.')

  const sortedResults = computed(() => {
    return [...results.value].sort((a, b) => {
      if (sortKey.value === 'updatedAt') {
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      }
      return (b[sortKey.value] || 0) - (a[sortKey.value] || 0)
    })
  })

  async function loadResults() {
    loading.value = true
    error.value = null
    statusText.value = 'Загружаем данные из внешнего API…'

    try {
      const safeQuery = query.value.trim() || 'transformers'
      query.value = safeQuery
      results.value = await hubApi.search({ query: safeQuery, type: type.value, limit: 18 })
      statusText.value = `Получено ${results.value.length} элементов по запросу «${safeQuery}».`
    } catch (err) {
      results.value = []
      error.value = err.message
      statusText.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    query,
    type,
    sortKey,
    results,
    sortedResults,
    loading,
    error,
    statusText,
    loadResults,
  }
}
