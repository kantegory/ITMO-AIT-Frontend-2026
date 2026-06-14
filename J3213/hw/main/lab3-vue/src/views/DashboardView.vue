<script setup>
import { computed, onMounted, reactive } from 'vue'
import SummaryStat from '../components/SummaryStat.vue'
import AccountCard from '../components/AccountCard.vue'
import BudgetProgress from '../components/BudgetProgress.vue'
import { useAuth } from '../composables/useAuth'
import { useTransactions } from '../composables/useTransactions'
import { formatMoney, formatDate } from '../utils/format'

const { currentUser } = useAuth()
const { accounts, budgets, transactions, summary, loadAll, addTransaction } = useTransactions()

const quickForm = reactive({
  description: '',
  category: 'Продукты',
  amount: '',
  type: 'expense',
})

const recentTransactions = computed(() => transactions.value.slice(0, 6))

const submitQuickTransaction = async () => {
  await addTransaction({
    description: quickForm.description,
    category: quickForm.category,
    amount: quickForm.amount,
    type: quickForm.type,
  })

  quickForm.description = ''
  quickForm.category = 'Продукты'
  quickForm.amount = ''
  quickForm.type = 'expense'
}

onMounted(loadAll)
</script>

<template>
  <section class="container">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
      <div>
        <div class="badge-soft mb-2">
          <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-wallet"></use></svg>
          Личный кабинет
        </div>
        <h1 class="section-title mb-2">Сводка по финансам</h1>
        <p class="muted mb-0">Пользователь: {{ currentUser?.name }}</p>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <SummaryStat title="Доходы за месяц"
                     :value="formatMoney(summary.income, currentUser?.currency || 'RUB')"
                     delta="Обновляется из API"
                     delta-class="positive" />
      </div>
      <div class="col-md-4">
        <SummaryStat title="Расходы за месяц"
                     :value="formatMoney(summary.expense, currentUser?.currency || 'RUB')"
                     delta="Обновляется из API"
                     delta-class="negative" />
      </div>
      <div class="col-md-4">
        <SummaryStat title="Свободный остаток"
                     :value="formatMoney(summary.net, currentUser?.currency || 'RUB')"
                     delta="Баланс доходов и расходов" />
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <section class="table-panel">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h4 mb-0">Счета пользователя</h2>
            <span class="small-note">{{ currentUser?.email }}</span>
          </div>
          <div class="row g-3">
            <div v-for="account in accounts" :key="account.id" class="col-md-6">
              <AccountCard :account="account" :format-money="formatMoney" />
            </div>
          </div>
        </section>

        <section class="table-panel mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h4 mb-0">Последние транзакции</h2>
            <RouterLink class="btn btn-outline-primary btn-sm" to="/transactions">Все операции</RouterLink>
          </div>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Дата</th>
                  <th scope="col">Категория</th>
                  <th scope="col">Описание</th>
                  <th scope="col">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recentTransactions" :key="item.id">
                  <td>{{ formatDate(item.date) }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.description }}</td>
                  <td :class="item.type === 'income' ? 'transaction-type-income' : 'transaction-type-expense'">
                    {{ item.type === 'income' ? '+' : '-' }}{{ formatMoney(item.amount, currentUser?.currency || 'RUB') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="col-lg-5">
        <section class="budget-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h4 mb-0">Бюджеты</h2>
            <span class="small-note">План / факт</span>
          </div>
          <div class="chart-list">
            <BudgetProgress
              v-for="budget in budgets"
              :key="budget.id"
              :budget="budget"
              :format-money="formatMoney"
              :currency="currentUser?.currency || 'RUB'"
            />
          </div>
        </section>

        <section class="chart-card mt-4">
          <h2 class="h4 mb-3">Быстрое добавление транзакции</h2>
          <form @submit.prevent="submitQuickTransaction">
            <div class="mb-3">
              <label class="form-label" for="quick-description">Описание</label>
              <input id="quick-description" v-model="quickForm.description" class="form-control" type="text" required>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="quick-category">Категория</label>
                <select id="quick-category" v-model="quickForm.category" class="form-select">
                  <option>Продукты</option>
                  <option>Транспорт</option>
                  <option>Развлечения</option>
                  <option>Доход</option>
                  <option>Коммунальные</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="quick-amount">Сумма</label>
                <input id="quick-amount" v-model="quickForm.amount" class="form-control" type="number" min="1" step="0.01" required>
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label" for="quick-type">Тип операции</label>
              <select id="quick-type" v-model="quickForm.type" class="form-select">
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>
            <button class="btn btn-primary mt-3" type="submit">Сохранить</button>
          </form>
        </section>
      </div>
    </div>
  </section>
</template>
