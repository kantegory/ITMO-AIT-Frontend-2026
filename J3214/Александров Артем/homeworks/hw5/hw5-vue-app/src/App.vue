<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      
      <TheSidebar />

      <!-- Дашборд -->
      <main class="col-12 col-md-9 col-lg-10 p-4 p-lg-5">
        <TheHeader :count="transactions.length" />

        <!-- Блок со счетами / балансом -->
        <div class="row g-4 mb-4 align-items-stretch">
          
          <!-- Баланс -->
          <div class="col-12 col-lg-6 d-flex flex-column">
            <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex justify-content-between align-items-center h-100 flex-grow-1">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 36px; height: 36px;">
                    <i class="bi bi-wallet2 fs-5"></i>
                  </div>
                  <span class="theme-text-muted fw-medium small">Итоговый баланс</span>
                </div>
                <h2 class="fw-bold m-0 display-6 theme-text-main">
                  ${{ (totalIncome - totalExpenses).toFixed(2) }}
                </h2>
              </div>
            </div>
          </div>

          <!-- Расходы и Доходы -->
          <div class="col-12 col-lg-6 d-flex flex-column">
            <div class="row g-4 h-100 flex-grow-1">
              
              <!-- Расходы -->
              <div class="col-6 d-flex flex-column">
                <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex flex-column justify-content-between h-100 flex-grow-1">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <div class="bg-danger-subtle text-danger rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
                        <i class="bi bi-arrow-down-right"></i>
                      </div>
                      <span class="theme-text-muted fw-medium small">Расходы</span>
                    </div>
                  </div>
                  <div>
                    <h3 class="fw-bold m-0 h4 text-danger">-${{ totalExpenses.toFixed(2) }}</h3>
                    <div class="theme-text-muted" style="font-size: 11px;">за текущий месяц</div>
                  </div>
                </div>
              </div>

              <!-- Доходы -->
              <div class="col-6 d-flex flex-column">
                <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex flex-column justify-content-between h-100 flex-grow-1">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <div class="bg-success-subtle text-success rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
                        <i class="bi bi-arrow-up-right"></i>
                      </div>
                      <span class="theme-text-muted fw-medium small">Доходы</span>
                    </div>
                  </div>
                  <div>
                    <h3 class="fw-bold m-0 h4 text-success">+${{ totalIncome.toFixed(2) }}</h3>
                    <div class="theme-text-muted" style="font-size: 11px;">за текущий месяц</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Форма добавления -->
        <TransactionForm @add-item="handleAddTransaction" />

        <!-- Список транзакций -->
        <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h6 fw-bold m-0 theme-text-main">Последние операции</h3>
            <span class="badge theme-bg-secondary theme-text-main border theme-border px-3 py-2 rounded-pill">
              Всего операций: {{ transactions.length }}
            </span>
          </div>

          <div v-if="transactions.length === 0" class="text-center py-4 theme-text-muted small">
            Операций пока нет
          </div>

          <div v-else class="d-flex flex-column">
            <TransactionItem 
              v-for="tx in transactions" 
              :key="tx.id" 
              :item="tx" 
              @delete-item="handleDeleteTransaction"
            />
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TheSidebar from './components/TheSidebar.vue'
import TheHeader from './components/TheHeader.vue'
import TransactionForm from './components/TransactionForm.vue'
import TransactionItem from './components/TransactionItem.vue'

const transactions = ref([
  { id: 1, title: 'Супермаркет «Лента»', amount: -45.50, category: 'Покупки', date: '20.04.2026' },
  { id: 2, title: 'Магазин «Nike»', amount: -120.00, category: 'Покупки', date: '20.04.2026' },
  { id: 3, title: 'Зарплата', amount: 5000.00, category: 'Доходы', date: '20.04.2026' }
])

const handleAddTransaction = (newTx) => {
  transactions.value.unshift(newTx)
}

const handleDeleteTransaction = (id) => {
  transactions.value = transactions.value.filter(tx => tx.id !== id)
}

const totalExpenses = computed(() => {
  return transactions.value
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
})

const totalIncome = computed(() => {
  return transactions.value
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
})
</script>