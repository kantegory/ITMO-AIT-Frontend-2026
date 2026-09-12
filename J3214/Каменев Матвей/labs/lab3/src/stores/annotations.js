import { ref } from 'vue'
import { defineStore } from 'pinia'
import { annotationsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

export const useAnnotationsStore = defineStore('annotations', () => {
  const auth = useAuthStore()

  const annotations = ref([])

  async function loadAnnotations() {
    const response = await annotationsApi.getMy(auth.user.id)

    annotations.value = response.data
  }

  async function isAccepted(orderId) {
    const response = await annotationsApi.getMy(auth.user.id, { orderId })

    return response.data.length > 0
  }

  async function acceptOrder(orderId) {
    if (await isAccepted(orderId)) {
      return
    }

    await annotationsApi.create({ userId: auth.user.id, orderId })
  }

  return { annotations, loadAnnotations, isAccepted, acceptOrder }
})
