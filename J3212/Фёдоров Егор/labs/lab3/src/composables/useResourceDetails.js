import { ref } from 'vue'
import { hubApi } from '@/services/api'

export function useResourceDetails() {
  const resource = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function loadModel(id) {
    await load(() => hubApi.getModel(id))
  }

  async function loadDataset(id) {
    await load(() => hubApi.getDataset(id))
  }

  async function load(loader) {
    loading.value = true
    error.value = null
    resource.value = null

    try {
      resource.value = await loader()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    resource,
    loading,
    error,
    loadModel,
    loadDataset,
  }
}
