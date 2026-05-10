<script setup>
import { ref } from 'vue'
import AccountsWidget from '../components/AccountsWidget.vue'
import FinanceWidget from '../components/FinanceWidget.vue'
import RecentTransactionsWidget from '../components/RecentTransactionsWidget.vue'
import TransactionModal from '../components/TransactionModal.vue'

const refreshKey = ref(0)

const handleTransactionAdded = () => {
  refreshKey.value += 1
}
</script>

<template>
  <main class="container mt-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-success fw-bold m-0 h2">Обзор финансов</h1>
      <button class="btn btn-success shadow-sm d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addTransactionModal" aria-label="Добавить новую транзакцию">
        <i class="bi bi-plus-circle me-2" aria-hidden="true"></i> Добавить транзакцию
      </button>
    </header>

    <div class="row">
      <div class="col-md-4">
        <AccountsWidget />
      </div>

      <div class="col-md-8">
        <FinanceWidget />

        <div class="card shadow-sm mb-4" style="border-radius: 15px;">
          <div class="card-body">
            <h3 class="card-title h5 mb-3 d-flex align-items-center">
              <i class="bi bi-calendar-event me-2 text-primary"></i> Ожидаемые траты
            </h3>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h4 class="h6 mb-0"><i class="bi bi-wifi me-2 text-muted"></i> Оплата интернета</h4>
                  <small class="text-muted ms-4">20 Марта 2026</small>
                </div>
                <span class="text-danger fw-bold">- 600 ₽</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h4 class="h6 mb-0"><i class="bi bi-music-note-beamed me-2 text-muted"></i> Подписка на музыку</h4>
                  <small class="text-muted ms-4">22 Марта 2026</small>
                </div>
                <span class="text-danger fw-bold">- 199 ₽</span>
              </li>
            </ul>
          </div>
        </div>

        <RecentTransactionsWidget :key="refreshKey" />
      </div>
    </div>

    <TransactionModal @transaction-added="handleTransactionAdded" />
  </main>
</template>
