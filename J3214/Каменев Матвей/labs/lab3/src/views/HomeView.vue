<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useAnnotationsStore } from '@/stores/annotations'
import useModal from '@/composables/useModal'
import useRequest from '@/composables/useRequest'

import BaseLayout from '@/layouts/BaseLayout.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import OrdersFilter from '@/components/orders/OrdersFilter.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import CurrencySwitcher from '@/components/common/CurrencySwitcher.vue'

const router = useRouter()
const auth = useAuthStore()
const ordersStore = useOrdersStore()
const annotationsStore = useAnnotationsStore()
const loginModal = useModal('loginModal')

const { loading, error } = useRequest(ordersStore.loadOrders, { immediate: true })

const search = ref('')
const type = ref('')

const types = computed(() => [...new Set(ordersStore.orders.map((order) => order.type))])

const filteredOrders = computed(() => {
  const query = search.value.trim().toLowerCase()

  return ordersStore.orders.filter(
    (order) => (!query || order.title.toLowerCase().includes(query)) && (!type.value || order.type === type.value),
  )
})

async function acceptOrder(order) {
  if (!auth.isAuthenticated) {
    loginModal.show()
    return
  }

  try {
    await annotationsStore.acceptOrder(order.id)
  } catch {
    alert('Не удалось принять заказ: сервер недоступен')
    return
  }

  router.push({ name: 'annotation', params: { id: order.id } })
}
</script>

<template>
  <base-layout>
    <hero-section />

    <section class="orders py-5" aria-labelledby="orders-heading">
      <div class="container">
        <h2 class="h3 mb-4 text-center" id="orders-heading">Доступные заказы</h2>
        <div class="row g-3 mb-4 align-items-center">
          <orders-filter v-model:search="search" v-model:type="type" :types="types" />
          <div class="col-md-3 d-flex justify-content-md-end">
            <currency-switcher />
          </div>
        </div>

        <p v-if="loading" class="text-center text-muted mt-5">Загрузка...</p>
        <p v-else-if="error" class="text-center text-muted mt-5">Не удалось загрузить заказы: сервер недоступен</p>
        <template v-else>
          <div id="orders-grid" class="row g-4">
            <div v-for="order in filteredOrders" :key="order.id" class="col-md-6 col-lg-3">
              <order-card :order="order">
                <template #action>
                  <button type="button" class="btn btn-primary mt-auto" @click="acceptOrder(order)">Принять</button>
                </template>
              </order-card>
            </div>
          </div>
          <p v-if="filteredOrders.length === 0" class="text-center text-muted mt-5" aria-live="polite">
            Ничего не найдено
          </p>
        </template>
      </div>
    </section>
  </base-layout>
</template>
