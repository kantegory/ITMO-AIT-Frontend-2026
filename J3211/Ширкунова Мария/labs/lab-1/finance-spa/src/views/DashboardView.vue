<script setup>
import { onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AccountCard from '@/components/AccountCard.vue'
import TransactionFormModal from '@/components/TransactionFormModal.vue'
import { useTransactions } from '@/composables/useTransactions'

const { accounts, loadTransactions, addTransaction } = useTransactions()

onMounted(loadTransactions)

const onAdd = async (data) => {
  await addTransaction(data)
}
</script>

<template>
  <AppNavbar />

  <main class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Сводка по счетам</h2>
      <button class="btn btn-success"
              data-bs-toggle="modal" data-bs-target="#addTransactionModal">
        + Добавить транзакцию
      </button>
    </div>

    <section class="row mb-5">
      <AccountCard v-for="acc in accounts" :key="acc.name"
                   :name="acc.name" :type="acc.type" :balance="acc.balance" />
    </section>
  </main>

  <TransactionFormModal @submit="onAdd" />
</template>
