<template>
  <main class="container mt-5 mb-5">
    <h1 class="mb-2">European Finals 2026 Tickets</h1>
    <p class="text-muted mb-4">Official tickets for all European club finals. On sale now.</p>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label" for="roundFilter">Tournament</label>
            <select class="form-select" id="roundFilter" v-model="filterRound">
              <option value="">All Finals</option>
              <option value="UCL">Champions League</option>
              <option value="UEL">Europa League</option>
              <option value="UECL">Conference League</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="searchInput">Search team</label>
            <input type="text" class="form-control" id="searchInput" placeholder="e.g. Arsenal" v-model="search" />
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-3">Available Matches</h2>
    <div class="results-grid mb-4">
      <TicketCard v-for="m in filteredMatches" :key="m.id" v-bind="m" :total="m.prices[0]">
        <template #action>
          <router-link :to="`/ticket/${m.id}`" class="btn btn-sm btn-primary" data-icon="tickets">Buy</router-link>
        </template>
      </TicketCard>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/instance'
import TicketCard from '@/components/TicketCard.vue'
import { injectIcons } from '@/composables/useIcons'

const matches = ref([])
const filterRound = ref('')
const search = ref('')

onMounted(async () => {
  const res = await api.get('/matches')
  matches.value = res.data.filter(m => ['UCL', 'UEL', 'UECL'].includes(m.roundId))
  setTimeout(() => injectIcons(), 0)
})

const filteredMatches = computed(() => {
  return matches.value.filter(m => {
    const mR = filterRound.value === '' || m.roundId === filterRound.value
    const mS = search.value === '' || m.left.toLowerCase().includes(search.value.toLowerCase()) || m.right.toLowerCase().includes(search.value.toLowerCase())
    return mR && mS
  })
})
</script>
