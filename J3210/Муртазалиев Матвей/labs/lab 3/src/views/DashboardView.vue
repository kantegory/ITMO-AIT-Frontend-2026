<template>
  <main id="main-content" class="page-section" tabindex="-1">
    <div class="container">
      <section class="page-banner">
        <div>
          <span class="section-label">Личный кабинет</span>
          <h1 class="section-title mt-3">{{ summary.greeting }}</h1>
          <p class="page-banner__copy">{{ summary.description }}</p>
        </div>
        <div class="page-banner__actions">
          <button class="btn btn-accent" type="button" @click="openAction('Новая транзакция', 'Добавьте ручную операцию, если она ещё не импортировалась из банка.')">
            <SvgIcon name="plus" class-name="icon--inline me-2" />Добавить транзакцию
          </button>
          <button class="btn btn-outline-dark" type="button" @click="openAction('Создать бюджет', 'Настройте новый лимит по категории или отдельному счёту.')">
            <SvgIcon name="sliders" class-name="icon--inline me-2" />Новый бюджет
          </button>
        </div>
      </section>

      <div v-if="loading" class="alert alert-light border" role="status">Загружаем данные из API...</div>
      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <template v-else>
        <section class="row g-4 mt-1">
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Общий баланс" :value="formatCurrency(summary.balance)" :status="summary.balanceStatus" status-class="positive" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Расходы месяца" :value="formatCurrency(summary.spend)" :status="summary.spendStatus" status-class="warning" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Накопления" :value="formatCurrency(summary.savings)" :status="summary.savingsStatus" status-class="positive" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Риск перерасхода" :value="`${summary.riskCount} категории`" :status="summary.riskStatus" :status-class="summary.riskCount ? 'negative' : 'positive'" />
          </div>
        </section>

        <section class="row g-4 mt-2">
          <div class="col-xl-8">
            <div class="content-card">
              <div class="content-card__head">
                <div>
                  <span class="section-label">Счета и транзакции</span>
                  <h2 class="h3 mt-2 mb-0">Основной денежный поток</h2>
                </div>
                <RouterLink class="btn btn-outline-dark btn-sm align-self-start" to="/integrations">Настроить импорт</RouterLink>
              </div>

              <div class="row g-3 mt-1" role="list" aria-label="Список счетов">
                <AccountCard v-for="account in accounts" :key="account.id" :account="account" />
              </div>

              <TransactionFilters
                :filters="filters"
                :categories="categories"
                :count="filteredTransactions.length"
                @reset="resetFilters"
              />
              <TransactionList :transactions="filteredTransactions" />
            </div>
          </div>

          <div class="col-xl-4">
            <div class="content-card h-100">
              <span class="section-label">Бюджеты</span>
              <h2 class="h3 mt-2 mb-3">Лимиты по категориям</h2>
              <BudgetList :budgets="budgets" :transactions="transactions" />
              <div class="tip-box mt-4">
                <h3>Подсказка</h3>
                <p class="mb-0 text-secondary">
                  {{ summary.topCategory ? `Проверьте категорию «${summary.topCategory.name}»: она занимает первое место по расходам.` : "Добавьте больше операций, чтобы увидеть подсказки." }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </main>

  <div v-if="actionModal.open" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="actionModalTitle">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header border-0">
          <h2 id="actionModalTitle" class="h4 mb-0">{{ actionModal.title }}</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="actionModal.open = false"></button>
        </div>
        <div class="modal-body">
          <p class="text-secondary mb-0">{{ actionModal.text }}</p>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-accent w-100" @click="actionModal.open = false">Понятно</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="actionModal.open" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { RouterLink } from "vue-router";
import SvgIcon from "@/components/SvgIcon.vue";
import AccountCard from "@/components/dashboard/AccountCard.vue";
import BudgetList from "@/components/dashboard/BudgetList.vue";
import MetricCard from "@/components/dashboard/MetricCard.vue";
import TransactionFilters from "@/components/dashboard/TransactionFilters.vue";
import TransactionList from "@/components/dashboard/TransactionList.vue";
import { useAuth } from "@/composables/useAuth";
import { useFinanceData } from "@/composables/useFinanceData";
import { useTransactionsFilter } from "@/composables/useTransactionsFilter";
import { buildDashboardSummary } from "@/utils/financeMetrics";
import { formatCurrency } from "@/utils/formatters";

const auth = useAuth();
const {
  accounts,
  budgets,
  transactions,
  loading,
  error,
  loadDashboardData,
} = useFinanceData();
const { filters, categories, filteredTransactions, resetFilters } = useTransactionsFilter(transactions);
const actionModal = reactive({
  open: false,
  title: "",
  text: "",
});

const summary = computed(() => buildDashboardSummary({
  user: auth.session.value?.user,
  accounts: accounts.value,
  budgets: budgets.value,
  transactions: transactions.value,
}));

function openAction(title, text) {
  actionModal.title = title;
  actionModal.text = text;
  actionModal.open = true;
}

onMounted(loadDashboardData);
</script>
