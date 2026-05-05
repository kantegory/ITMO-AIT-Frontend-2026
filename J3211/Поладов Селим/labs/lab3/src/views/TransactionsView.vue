<template>
  <AppLayout title="Транзакции">
    <TransactionsFilters :filters="filters" />

    <div class="content-card">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Название / Контрагент</th>
              <th>Тип</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Счёт</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="6" class="text-center text-muted py-3">Загрузка...</td></tr>
            <tr v-else-if="!items.length"><td colspan="6" class="text-center text-muted py-3">Транзакции не найдены</td></tr>
            <TransactionRow
              v-for="t in items"
              :key="t.id"
              :transaction="t"
              show-counterparty
              show-account
              actionable
              with-time
              @view="selected = $event"
            />
          </tbody>
        </table>
      </div>
    </div>

    <TransactionDetailsModal :transaction="selected" @close="selected = null" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import TransactionsFilters from '../components/TransactionsFilters.vue'
import TransactionRow from '../components/TransactionRow.vue'
import TransactionDetailsModal from '../components/TransactionDetailsModal.vue'
import { useTransactionsList } from '../composables/useTransactionsList.js'

const { filters, items, loading, load } = useTransactionsList()
const selected = ref(null)

onMounted(load)
</script>
