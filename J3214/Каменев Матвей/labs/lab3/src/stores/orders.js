import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ordersApi } from '@/api'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  async function loadOrders() {
    const response = await ordersApi.getAll()

    orders.value = response.data
  }

  return { orders, loadOrders }
})
