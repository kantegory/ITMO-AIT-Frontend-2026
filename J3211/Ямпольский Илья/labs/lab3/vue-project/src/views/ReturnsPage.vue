<template>
  <BaseLayout>
    <section class="returns-content container py-4">
      <header>
        <h1 class="h4 mb-4">Возвраты билетов</h1>
      </header>
      <aside class="alert alert-info mb-4">
        Полный возврат возможен не позднее чем за 24 часа до начала мероприятия.
        Средства возвращаются в течение 3-5 рабочих дней.
      </aside>
      <article class="row g-4">
        <div class="col-12 col-lg-6" v-for="ret in returnsWithEventName" :key="ret.id">
          <ReturnCard
            :event-name="ret.eventName"
            :seats="ret.seats"
            :amount="ret.amount"
            :ticket-id="ret.ticketId"
            :status="ret.status"
            :request-date="ret.requestDate"
          />
        </div>
      </article>
    </section>
  </BaseLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReturnsStore } from '@/stores/returns'
import BaseLayout from '@/layouts/BaseLayout.vue'
import ReturnCard from '@/components/ReturnCard.vue'

export default {
  name: 'ReturnsPage',
  components: { BaseLayout, ReturnCard },
  setup() {
    const auth = useAuthStore()
    const returnsStore = useReturnsStore()
    const ticketsMap = ref({})

    auth.loadFromStorage()

    const returnsWithEventName = computed(() => {
      return returnsStore.returns.map(ret => {
        const ticket = ticketsMap.value[ret.ticketId]
        return {
          ...ret,
          eventName: ticket ? ticket.eventName : 'Билет #' + ret.ticketId,
          seats: ticket ? ticket.seats : ''
        }
      })
    })

    const loadTickets = async () => {
      try {
        const response = await fetch('http://localhost:3000/tickets')
        const tickets = await response.json()
        const map = {}
        tickets.forEach(ticket => {
          map[ticket.id] = ticket
        })
        ticketsMap.value = map
      } catch (error) {
        console.error('Ошибка загрузки билетов:', error)
      }
    }

    onMounted(async () => {
      await loadTickets()
      await returnsStore.loadReturns(auth.user?.id)
    })

    return {
      returnsWithEventName
    }
  }
}
</script>
