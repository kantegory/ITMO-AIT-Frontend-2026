import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'

export function useUserFinanceData(extraLoaders = []) {
  const authStore = useAuthStore()
  const financeStore = useFinanceStore()

  async function loadUserFinanceData() {
    const userId = authStore.user?.id

    if (!userId) return []

    return Promise.allSettled([
      financeStore.loadAll(userId),
      ...extraLoaders.map((loader) => loader())
    ])
  }

  onMounted(loadUserFinanceData)

  return {
    authStore,
    financeStore,
    loadUserFinanceData
  }
}
