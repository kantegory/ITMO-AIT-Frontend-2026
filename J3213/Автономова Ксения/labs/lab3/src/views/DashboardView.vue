<template>
  <PageShell>
    <h2>Мои билеты</h2>
    <div v-if="loading">Загрузка...</div>
    <TicketList v-else :items="tickets" :events="events" empty-text="Вы ещё не купили билеты." returnable @return-ticket="handleReturnTicket" />
    <h3 class="mt-4">Возвраты</h3>
    <TicketList :items="returns" :events="events" empty-text="Нет возвращённых билетов." />
  </PageShell>
</template>
<script setup>
import { onMounted } from 'vue'
import PageShell from '../components/PageShell.vue'
import TicketList from '../components/TicketList.vue'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import { useTickets } from '../composables/useTickets'
const { user } = useAuth()
const { events, loadEvents } = useEvents()
const { tickets, returns, loading, loadMyTickets, loadMyReturns, returnTicket } = useTickets()
async function loadDashboard() {
  await loadEvents()
  await Promise.all([loadMyTickets(user.value.id), loadMyReturns(user.value.id)])
}
async function handleReturnTicket(ticket) {
  try {
    await returnTicket(ticket, user.value.id)
    await loadDashboard()
  } catch (err) {
    alert(err.response?.data || err.message || 'Не удалось вернуть билет')
  }
}
onMounted(loadDashboard)
</script>
