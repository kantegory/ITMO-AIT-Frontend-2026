<template>
  <h1 class="fs-2 mb-4">Личный кабинет</h1>
  <div class="row">
    <div class="col-md-3">
      <div class="card shadow-sm p-3 text-center">
        <h3>{{ user?.firstName }} {{ user?.lastName }}</h3>
        <p class="text-muted">{{ user?.email }}</p>
      </div>
    </div>
    <div class="col-md-9">
      <div class="card shadow-sm p-4">
        <h3>Мои билеты</h3>
        <div v-if="tickets.length === 0" class="text-muted py-3">Билетов нет</div>
        <ul v-else class="list-group">
          <li v-for="t in tickets" :key="t.id" class="list-group-item d-flex justify-content-between">
            <span>{{ t.event?.title }}</span>
            <span class="badge bg-success">Активен</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTickets } from '@/composables/useTickets'

const { currentUser } = useAuth()
const { tickets, fetchTickets } = useTickets()
const user = ref(null)

onMounted(async () => {
  user.value = currentUser.value
  if (user.value) await fetchTickets(user.value.id)
})
</script>