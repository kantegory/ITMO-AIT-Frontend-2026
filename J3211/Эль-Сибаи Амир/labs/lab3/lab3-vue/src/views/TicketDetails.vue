<template>
  <main class="container mt-5 mb-5" v-if="m">
    <router-link to="/tickets" class="btn btn-secondary mb-4">Back to Tickets</router-link>
    <div class="result-row mb-4" :style="{ background: m.grad, maxWidth: '500px', borderRadius: '8px' }">
      <span class="club-left" :style="m.leftStyle">{{ m.left }}</span>
      <span class="result-score" :style="m.scoreStyle">vs</span>
      <span class="club-right" :style="m.rightStyle">{{ m.right }}</span>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">Match Info</h5>
            <p class="mb-1"><strong>Round:</strong> <span>{{ m.round }}</span></p>
            <p class="mb-1"><strong>Date:</strong> <span>{{ m.date }}</span></p>
            <p class="mb-1"><strong>Venue:</strong> <span>{{ m.venue }}</span></p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">Buy Tickets</h5>
            <div class="mb-3">
              <label class="form-label" for="category">Category</label>
              <select class="form-select" id="category" v-model="selectedPrice">
                <option v-for="(p, i) in m.prices" :value="p" :key="i">
                  {{ ['Standard', 'Business', 'VIP Box'][i] }} - {{ p }} EUR
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label" for="qty">Quantity</label>
              <input type="number" class="form-control" id="qty" v-model="qty" min="1" max="10" />
            </div>
            <p class="mb-3">Total: <strong>{{ totalPrice }} EUR</strong></p>
            <button class="btn btn-primary w-100" @click="handleBuy">Buy Ticket</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/instance'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const m = ref(null)
const selectedPrice = ref(0)
const qty = ref(1)

const totalPrice = computed(() => selectedPrice.value * qty.value)

onMounted(async () => {
  const res = await api.get(`/matches/${route.params.id}`)
  m.value = res.data
  if (m.value.prices.length > 0) {
    selectedPrice.value = m.value.prices[0]
  }
})

const handleBuy = async () => {
  if (!auth.isAuthenticated) {
    alert('Please sign in to buy tickets.')
    return router.push('/login')
  }

  const categoryName = ['Standard', 'Business', 'VIP Box'][m.value.prices.indexOf(selectedPrice.value)]

  const ticketData = {
    userId: auth.user.id,
    matchId: m.value.id,
    left: m.value.left,
    right: m.value.right,
    leftStyle: m.value.leftStyle || '',
    rightStyle: m.value.rightStyle || '',
    scoreStyle: m.value.scoreStyle || '',
    grad: m.value.grad,
    date: m.value.date,
    category: categoryName,
    total: totalPrice.value,
    status: 'Active',
    qty: qty.value
  }

  await api.post('/tickets', ticketData)
  alert('Ticket purchased successfully!')
  router.push('/dashboard')
}
</script>
