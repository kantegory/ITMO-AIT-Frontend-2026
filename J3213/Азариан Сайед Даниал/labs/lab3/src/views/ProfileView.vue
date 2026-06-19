<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import RefundModal from '../components/RefundModal.vue'
import TicketCard from '../components/TicketCard.vue'
import { useAuth } from '../composables/useAuth'
import { useTickets } from '../composables/useTickets'

const router = useRouter()
const { currentUser, loadCurrentUser } = useAuth()
const { requestRefund } = useTickets()

const selectedTicket = ref(null)
const submittingRefund = ref(false)

const tickets = computed(() => currentUser.value?.tickets || [])
const refunds = computed(() => currentUser.value?.refunds || [])
const initials = computed(() => {
  const parts = String(currentUser.value?.name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '--'
})

onMounted(async () => {
  const user = currentUser.value || (await loadCurrentUser())
  if (!user) {
    router.replace('/auth')
    return
  }

  if (user.accountType === 'organizer') {
    router.replace('/organizer')
  }
})

async function submitRefund(reason) {
  if (!selectedTicket.value) {
    return
  }

  submittingRefund.value = true

  try {
    await requestRefund(selectedTicket.value.id, reason)
    selectedTicket.value = null
  } finally {
    submittingRefund.value = false
  }
}
</script>

<template>
  <AppNavbar active-page="profile" />

  <main class="cabinet-page py-4 py-lg-5">
    <div class="container">
      <div v-if="!currentUser" class="alert alert-light border">Загружаем профиль...</div>

      <div v-else class="row g-4">
        <div class="col-lg-4 col-xl-3">
          <aside class="cabinet-card p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="avatar-circle">{{ initials }}</div>
              <div>
                <h1 class="h5 m-0">{{ currentUser.name }}</h1>
                <p class="text-secondary small m-0">{{ currentUser.email }}</p>
              </div>
            </div>

            <ul class="list-unstyled m-0 small">
              <li class="d-flex justify-content-between py-2">
                <span>Активные билеты</span><strong>{{ tickets.length }}</strong>
              </li>
              <li class="d-flex justify-content-between py-2">
                <span>Заявки на возврат</span><strong>{{ refunds.length }}</strong>
              </li>
              <li class="d-flex justify-content-between py-2">
                <span>Успешные покупки</span><strong>{{ tickets.length }}</strong>
              </li>
            </ul>
          </aside>
        </div>

        <div class="col-lg-8 col-xl-9">
          <section class="cabinet-card p-3 p-sm-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h2 class="h4 m-0">Личный кабинет пользователя</h2>
              <span class="text-secondary small">Данные аккаунта загружены</span>
            </div>

            <ul class="nav nav-pills mb-4" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#tickets-pane" type="button" role="tab">
                  Билеты
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="pill" data-bs-target="#returns-pane" type="button" role="tab">
                  Возвраты
                </button>
              </li>
            </ul>

            <div class="tab-content">
              <div id="tickets-pane" class="tab-pane fade show active" role="tabpanel" tabindex="0">
                <div v-if="!tickets.length" class="empty-state">У вас пока нет купленных билетов.</div>
                <div v-else class="row g-3">
                  <div v-for="ticket in tickets" :key="ticket.id" class="col-md-6">
                    <TicketCard :ticket="ticket" @refund="selectedTicket = $event" />
                  </div>
                </div>
              </div>

              <div id="returns-pane" class="tab-pane fade" role="tabpanel" tabindex="0">
                <div class="table-responsive">
                  <table class="table align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Заказ</th>
                        <th scope="col">Событие</th>
                        <th scope="col">Дата заявки</th>
                        <th scope="col">Сумма</th>
                        <th scope="col">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!refunds.length">
                        <td colspan="5"><div class="empty-state my-2">Заявок на возврат пока нет.</div></td>
                      </tr>
                      <tr v-for="refund in refunds" v-else :key="refund.ticketId">
                        <td>#{{ refund.ticketId }}</td>
                        <td>{{ refund.eventName }}</td>
                        <td>{{ refund.requestedAt }}</td>
                        <td>{{ refund.amount ? `${Number(refund.amount).toLocaleString('ru-RU')} руб.` : 'Будет рассчитана' }}</td>
                        <td><span class="badge text-bg-secondary">В обработке</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>

  <RefundModal
    :ticket="selectedTicket"
    :submitting="submittingRefund"
    @close="selectedTicket = null"
    @submit="submitRefund"
  />
</template>
