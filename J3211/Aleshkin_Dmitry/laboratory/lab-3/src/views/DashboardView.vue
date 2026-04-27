<template>
  <main class="container">
    <DemoBanner :is-demo="finance.isDemo.value" />
    <BaseAlert :message="notice.message || finance.error.value" :type="notice.type" />

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h1>Личный кабинет пользователя</h1>
        <p class="mb-1"><strong>Имя:</strong> {{ finance.currentUser.value?.name }}</p>
        <p class="mb-1"><strong>Email:</strong> {{ finance.currentUser.value?.email }}</p>
        <p class="mb-0">
          <strong>Дата регистрации:</strong>
          {{ finance.formatDate(finance.currentUser.value?.joinedDate) }}
        </p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <StatCard label="Общий баланс" :value="finance.formatCurrency(finance.summary.value.totalBalance)" />
      </div>
      <div class="col-12 col-md-4">
        <StatCard label="Доходы" :value="finance.formatCurrency(finance.summary.value.income)" />
      </div>
      <div class="col-12 col-md-4">
        <StatCard label="Расходы" :value="finance.formatCurrency(finance.summary.value.expenses)" />
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h2 class="mb-3">Счета</h2>
            <AccountsList
              :accounts="finance.accounts.value"
              :format-currency="finance.formatCurrency"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h2 class="mb-0">Запланированные расходы</h2>
              <small class="text-muted">
                Можно менять значения, добавлять и удалять категории
              </small>
            </div>

            <BudgetForm
              :categories="finance.categories"
              :model-value="budgetForm"
              :disabled="finance.isDemo.value"
              @save="saveBudget"
            />

            <BudgetTable
              :budgets="finance.budgets.value"
              :expenses-by-category="finance.expensesByCategory.value"
              :format-currency="finance.formatCurrency"
              :disabled="finance.isDemo.value"
              @edit="editBudget"
              @remove="removeBudget"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import AccountsList from '../components/AccountsList.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BudgetForm from '../components/BudgetForm.vue';
import BudgetTable from '../components/BudgetTable.vue';
import DemoBanner from '../components/DemoBanner.vue';
import StatCard from '../components/StatCard.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const finance = useFinanceManager();

const budgetForm = reactive({
  id: '',
  category: 'products',
  limit: null,
});

const notice = reactive({
  message: '',
  type: 'info',
});

function editBudget(budget) {
  budgetForm.id = budget.id;
  budgetForm.category = budget.category;
  budgetForm.limit = budget.limit;
}

async function saveBudget(payload) {
  try {
    if (payload.id) {
      await finance.updateBudget(payload.id, {
        category: payload.category,
        categoryName: payload.categoryName,
        limit: Number(payload.limit),
      });
      notice.message = 'Бюджет обновлён.';
    } else {
      await finance.addBudget({
        userId: finance.currentUser.value.id,
        category: payload.category,
        categoryName: payload.categoryName,
        limit: Number(payload.limit),
      });
      notice.message = 'Бюджет добавлен.';
    }

    notice.type = 'success';
    budgetForm.id = '';
    budgetForm.category = 'products';
    budgetForm.limit = null;
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}

async function removeBudget(id) {
  try {
    await finance.deleteBudget(id);
    notice.message = 'Бюджет удалён.';
    notice.type = 'success';
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}
</script>