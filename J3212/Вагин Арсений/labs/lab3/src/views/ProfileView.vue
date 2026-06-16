<template>
  <div class="container flex-grow-1 mt-5 py-5" v-if="currentUser">
    <div class="row">
      <div class="col-md-4 col-lg-3 mb-4">
        <h4>Аккаунт</h4>
        <div class="list-group">
          <a href="#" class="list-group-item active">История заказов</a>
          <a href="#" class="list-group-item">Данные профиля</a>
        </div>
      </div>

      <div class="col-md-8 col-lg-9 px-lg-5">
        <div class="d-flex justify-content-between align-items-center mb-5">
          <h2 class="h3 mb-0">История заказов</h2>
          <span class="text-muted small">{{ currentUser.email }}</span>
        </div>

        <div v-if="orders.length === 0" class="text-muted">У вас пока нет заказов.</div>
        <div v-else v-for="order in orders" :key="order.id" class="card rounded-0 mb-4 border-0 border-bottom pb-4 bg-transparent">
           <div class="d-flex justify-content-between small text-muted mb-3">
             <span>Order #{{ order.orderNumber }} • {{ order.date }}</span>
             <span class="badge border text-dark">{{ order.status }}</span>
           </div>
           <div class="d-flex align-items-center" v-for="item in order.items" :key="item.name">
              <img :src="item.image" style="width: 80px; height: 110px; object-fit: cover;" class="me-4 border">
              <div>
                <p class="small text-muted mb-1">Total: {{ order.total }} ₽</p>
                <h5>{{ item.name }} (Size {{ item.size }})</h5>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import axios from 'axios'

const { currentUser } = useAuth()
const orders = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/orders')
    orders.value = data.filter(o => String(o.userId) === String(currentUser.value.id))
  } catch (e) {
    console.error(e)
  }
})
</script>