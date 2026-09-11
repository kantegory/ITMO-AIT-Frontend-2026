<template>
  <base-layout>
    <h1 class="mb-4">Личный кабинет</h1>

    <p v-if="isLoading" class="text-muted">Загружаем билеты…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>

    <template v-else>
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li v-for="tab in tabs" :key="tab.id" class="nav-item" role="presentation">
          <button
            :id="`${tab.id}-tab`"
            type="button"
            class="nav-link"
            :class="{ active: activeTab === tab.id }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`${tab.id}-pane`"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>

      <section v-show="activeTab === 'tickets'" id="tickets-pane" role="tabpanel" aria-labelledby="tickets-tab" tabindex="0">
        <ticket-table v-if="tickets.length" :tickets="tickets" :events="events" @refund="openRefund" />
        <p v-else class="text-muted">Билетов пока нет.</p>
      </section>

      <section v-show="activeTab === 'refunds'" id="refunds-pane" role="tabpanel" aria-labelledby="refunds-tab" tabindex="0">
        <div v-if="refunds.length" class="table-responsive">
          <table class="table align-middle">
            <caption class="visually-hidden">История возвратов</caption>
            <thead>
              <tr>
                <th scope="col">Мероприятие</th>
                <th scope="col">Дата запроса</th>
                <th scope="col">Причина</th>
                <th scope="col">Сумма</th>
                <th scope="col">Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="refund in refunds" :key="refund.id">
                <td>{{ eventTitle(refund.eventId) }}</td>
                <td>{{ refund.date }}</td>
                <td>{{ refund.reason || '—' }}</td>
                <td>{{ refund.amount }}</td>
                <td><span class="ticket-row__status--refunded">Возвращено</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-muted">Возвратов пока нет.</p>
      </section>

      <section v-show="activeTab === 'settings'" id="settings-pane" role="tabpanel" aria-labelledby="settings-tab" tabindex="0">
        <form class="col-12 col-md-6" aria-label="Данные аккаунта" @submit.prevent="onSave">
          <div class="mb-3">
            <label for="profileName" class="form-label">Имя</label>
            <input id="profileName" v-model="profile.name" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="profileEmail" class="form-label">Email</label>
            <input id="profileEmail" :value="user.email" type="email" class="form-control" disabled />
            <div class="form-text">Email используется для входа, его менять нельзя.</div>
          </div>

          <button type="submit" class="btn btn-brand">Сохранить</button>

          <p v-if="savedMessage" class="text-success mt-3 mb-0" aria-live="polite">{{ savedMessage }}</p>
        </form>
      </section>
    </template>

    <modal-dialog v-if="refundTarget" title="Оформление возврата" @close="refundTarget = null">
      <div class="mb-3">
        <label for="refundReason" class="form-label">Причина возврата</label>
        <select id="refundReason" v-model="reason" class="form-select">
          <option>Не смогу присутствовать</option>
          <option>Ошибка при покупке</option>
          <option>Другое</option>
        </select>
      </div>

      <p class="text-muted mb-0">Средства вернутся на карту в течение 5–7 рабочих дней.</p>

      <template #footer>
        <button type="button" class="btn btn-brand" @click="onRefund">Подтвердить возврат</button>
      </template>
    </modal-dialog>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import TicketTable from '@/components/common/TicketTable.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import useAuthStore from '@/stores/auth'
import useEventsStore from '@/stores/events'
import useTicketsStore from '@/stores/tickets'
import { useRequest } from '@/composables/useRequest'

export default {
  name: 'ProfilePage',
  components: { BaseLayout, TicketTable, ModalDialog },

  setup() {
    const auth = useAuthStore()
    const events = useEventsStore()
    const tickets = useTicketsStore()

    const { isLoading, error, run } = useRequest(async () => {
      await events.loadEvents()
      await tickets.loadTickets(auth.user.id)
      await tickets.loadRefunds(auth.user.id)
    })

    return { isLoading, error, run }
  },

  data() {
    return {
      tabs: [
        { id: 'tickets', label: 'Мои билеты' },
        { id: 'refunds', label: 'Возвраты' },
        { id: 'settings', label: 'Данные аккаунта' },
      ],
      activeTab: 'tickets',
      refundTarget: null,
      reason: 'Не смогу присутствовать',
      profile: { name: '' },
      savedMessage: '',
    }
  },

  computed: {
    ...mapState(useAuthStore, ['user']),
    ...mapState(useEventsStore, ['events']),
    ...mapState(useTicketsStore, ['tickets', 'refunds']),
  },

  methods: {
    ...mapActions(useAuthStore, ['updateUser']),
    ...mapActions(useTicketsStore, ['refundTicket']),

    eventTitle(id) {
      return this.events.find((event) => event.id === id)?.title || 'Мероприятие удалено'
    },

    openRefund(ticket) {
      this.refundTarget = ticket
      this.reason = 'Не смогу присутствовать'
    },

    async onRefund() {
      const ticket = this.refundTarget
      const event = this.events.find((item) => item.id === ticket.eventId)

      this.refundTarget = null

      await this.refundTicket({ ticket, event, userId: Number(this.user.id), reason: this.reason })
      await this.run()
    },

    async onSave() {
      await this.updateUser({ name: this.profile.name })

      this.savedMessage = 'Данные сохранены.'
    },
  },

  mounted() {
    this.profile.name = this.user.name
    this.run()
  },
}
</script>
