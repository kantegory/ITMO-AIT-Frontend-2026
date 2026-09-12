import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ordersApi, datapointsApi, resultsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useAnnotationsStore } from '@/stores/annotations'

export const useTaskStore = defineStore('task', () => {
  const auth = useAuthStore()
  const annotationsStore = useAnnotationsStore()

  const order = ref(null)
  const datapoints = ref([])
  const results = ref([])
  const accepted = ref(false)

  const currentDatapoint = computed(() =>
    datapoints.value.find(({ id }) => !results.value.some(({ datapointId }) => datapointId === id)),
  )

  const progress = computed(() => ({
    current: results.value.length + 1,
    total: datapoints.value.length,
  }))

  async function loadTask(orderId) {
    order.value = null

    const [orderResponse, datapointsResponse, resultsResponse, isAccepted] = await Promise.all([
      ordersApi.getById(orderId),
      datapointsApi.getByOrder(orderId),
      resultsApi.getMy(auth.user.id, orderId),
      annotationsStore.isAccepted(orderId),
    ])

    order.value = orderResponse.data
    datapoints.value = datapointsResponse.data
    results.value = resultsResponse.data
    accepted.value = isAccepted
  }

  async function acceptOrder() {
    await annotationsStore.acceptOrder(order.value.id)

    accepted.value = true
  }

  async function submitResult(value) {
    const response = await resultsApi.create({
      userId: auth.user.id,
      orderId: order.value.id,
      datapointId: currentDatapoint.value.id,
      value,
    })

    results.value.push(response.data)
  }

  return {
    order,
    datapoints,
    results,
    accepted,
    currentDatapoint,
    progress,
    loadTask,
    acceptOrder,
    submitResult,
  }
})
