import { computed, ref } from 'vue'
import api from '../services/api'

export function useItems() {
  const models = ref([])
  const datasets = ref([])

  const loadItems = async () => {
    const [modelsResponse, datasetsResponse] = await Promise.all([
      api.get('/models'),
      api.get('/datasets')
    ])
    models.value = modelsResponse.data
    datasets.value = datasetsResponse.data
  }

  const allItems = computed(() => [...models.value, ...datasets.value])

  const getItem = async (type, id) => {
    const resource = type === 'dataset' ? 'datasets' : 'models'
    const response = await api.get(`/${resource}/${id}`)
    return response.data
  }

  const updateStat = async (item, field) => {
    const resource = item.type === 'dataset' ? 'datasets' : 'models'
    const nextValue = Number(item[field] || 0) + 1
    const response = await api.patch(`/${resource}/${item.id}`, { [field]: nextValue })
    return response.data
  }

  return { models, datasets, allItems, loadItems, getItem, updateStat }
}
