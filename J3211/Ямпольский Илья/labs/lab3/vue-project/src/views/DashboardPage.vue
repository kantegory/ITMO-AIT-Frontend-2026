<template>
  <BaseLayout>
    <section class="dashboard-content container py-4">
      <header>
        <h1 class="h4 mb-4">Мои билеты</h1>
      </header>
      <article class="row g-4">
        <div class="col-12 col-lg-6" v-for="ticket in tickets.tickets" :key="ticket.id">
          <TicketCard :ticket="ticket" @return="returnTicket"/>
        </div>
      </article>
    </section>
  </BaseLayout>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import { useReturnsStore } from '@/stores/returns'
import BaseLayout from '@/layouts/BaseLayout.vue'
import TicketCard from '@/components/TicketCard.vue'

export default {
  name: 'DashboardPage',
  components: { BaseLayout, TicketCard },
  setup() {
    const auth = useAuthStore()
    const tickets = useTicketsStore()
    const returns = useReturnsStore()

    auth.loadFromStorage()

    onMounted(async () => {
      await tickets.loadTickets(auth.user.id)
    })

    const returnTicket = async (ticketId, amount) => {
      if (!confirm('Вернуть билет? Средства будут возвращены в течение 3-5 рабочих дней.')) {
        return
      }
      const returnData = {
        ticketId: ticketId,
        userId: auth.user.id,
        status: 'processing',
        requestDate: new Date().toISOString().split('T')[0],
        amount: amount
      }
      await returns.createReturn(returnData)
      await tickets.returnTicket(ticketId)
      alert('Заявка на возврат создана!')
      await tickets.loadTickets(auth.user.id)
    }

    return { tickets, returnTicket }
  }
}
</script>
