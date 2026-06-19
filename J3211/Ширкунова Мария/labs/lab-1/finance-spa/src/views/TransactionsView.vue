<script setup>
import { onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import TransactionRow from '@/components/TransactionRow.vue'
import { useTransactions } from '@/composables/useTransactions'

const { filters, filteredTransactions, loadTransactions, loading } = useTransactions()

onMounted(loadTransactions)
</script>

<template>
  <AppNavbar />

  <main class="container py-5">
    <h2>История транзакций</h2>

    <FilterPanel v-model="filters" />

    <div v-if="loading" class="text-center py-4">Загрузка...</div>

    <div v-else class="table-wrapper mb-5">
      <table class="table table-hover table-borderless align-middle">
        <thead class="table-light">
          <tr>
            <th class="py-3 px-4">Дата</th>
            <th class="py-3">Счёт</th>
            <th class="py-3">Описание</th>
            <th class="py-3">Категория</th>
            <th class="py-3">Сумма</th>
          </tr>
        </thead>
        <tbody>
          <TransactionRow v-for="t in filteredTransactions"
                          :key="t.id" :transaction="t" />
          <tr v-if="!filteredTransactions.length">
            <td colspan="5" class="text-center text-muted py-4">Нет данных</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
