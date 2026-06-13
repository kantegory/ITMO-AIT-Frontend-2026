import { ref } from 'vue'
import api from '../api/axios'

export function useIntegrations() {
  const integrations = ref([])
  const rules = ref([])

  async function loadIntegrations(userId) {
    const [integrationsRes, rulesRes] = await Promise.all([
      api.get('/integrations', { params: { userId } }),
      api.get('/rules', { params: { userId } }),
    ])

    integrations.value = integrationsRes.data
    rules.value = rulesRes.data
  }

  return {
    integrations,
    rules,
    loadIntegrations,
  }
}