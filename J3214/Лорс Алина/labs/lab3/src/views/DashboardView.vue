<template>
  <AppLayout title="Личный кабинет" subtitle="Обзор финансов">
    <PageHeader
      kicker="Личный кабинет"
      :title="`Добро пожаловать, ${currentUser?.firstName || 'пользователь'}`"
      :description="todayText"
    >
      <button class="btn btn-outline-primary" type="button" @click="showAccountForm = !showAccountForm">
        <IconSprite name="plus-circle" /> Добавить счёт
      </button>
    </PageHeader>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="alert alert-info">Данные загружаются...</div>

    <form v-if="showAccountForm" class="card border-0 shadow-sm mb-4" @submit.prevent="handleAddAccount">
      <div class="card-body">
        <h2 class="h5 mb-3">Новый счёт</h2>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label" for="accountName">Название</label>
            <input id="accountName" v-model.trim="accountForm.name" class="form-control" required />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="accountType">Тип</label>
            <select id="accountType" v-model="accountForm.type" class="form-select">
              <option value="card">Банковская карта</option>
              <option value="savings">Накопительный счёт</option>
              <option value="cash">Наличные</option>
              <option value="investment">Инвестиционный счёт</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="accountBalance">Начальный баланс</label>
            <input id="accountBalance" v-model.number="accountForm.initialBalance" class="form-control" type="number" step="0.01" required />
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-primary w-100" type="submit">Сохранить</button>
          </div>
        </div>
      </div>
    </form>

    <section class="row g-3 mb-4" aria-label="Финансовые показатели">
      <div class="col-md-6 col-xl-3">
        <StatCard label="Общий баланс" :value="formatMoney(metrics.totalBalance)" icon="wallet2" hint="по всем счетам" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Доходы месяца" :value="formatMoney(metrics.monthlyIncome)" icon="arrow-up-right-circle" hint="текущий месяц" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Расходы месяца" :value="formatMoney(metrics.monthlyExpenses)" icon="arrow-down-right-circle" hint="текущий месяц" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Бюджеты" :value="`${metrics.budgetsProgress}%`" icon="bookmark-star" hint="среднее заполнение" />
      </div>
    </section>

    <section class="row g-3 mb-4">
      <div v-for="account in accountsWithBalance" :key="account.id" class="col-md-6 col-xl-3">
        <AccountCard :account="account" :format-money="formatMoney" />
      </div>
    </section>

    <section class="row g-4">
      <div class="col-xl-7">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">Последние операции</h2>
              <RouterLink to="/transactions" class="btn btn-outline-primary btn-sm">Все операции</RouterLink>
            </div>
            <TransactionTable :transactions="recentTransactions" :format-money="formatMoney" />
          </div>
        </div>
      </div>
      <div class="col-xl-5">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Бюджеты</h2>
            <div class="d-grid gap-3">
              <BudgetProgress v-for="budget in metrics.budgets" :key="budget.id" :budget="budget" :format-money="formatMoney" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PageHeader from '../components/PageHeader.vue';
import StatCard from '../components/StatCard.vue';
import AccountCard from '../components/AccountCard.vue';
import BudgetProgress from '../components/BudgetProgress.vue';
import TransactionTable from '../components/TransactionTable.vue';
import IconSprite from '../components/IconSprite.vue';
import { useAuth } from '../composables/useAuth';
import { useFinance } from '../composables/useFinance';
import { useToast } from '../composables/useToast';

const { currentUser } = useAuth();
const { showToast } = useToast();
const { loading, error, metrics, accountsWithBalance, syncData, addAccount, formatMoney, currency } = useFinance();

const showAccountForm = ref(false);
const accountForm = reactive({ name: '', type: 'card', initialBalance: 0 });
const todayText = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const recentTransactions = computed(() => metrics.value.recentTransactions.map((item) => ({ ...item, accountName: accountsWithBalance.value.find((account) => account.id === item.accountId)?.name || '—' })));

onMounted(syncData);

async function handleAddAccount() {
  await addAccount({ ...accountForm, currency: currency.value });
  accountForm.name = '';
  accountForm.initialBalance = 0;
  showAccountForm.value = false;
  showToast('Счёт добавлен');
}
</script>
