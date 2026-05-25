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
          <button class="btn btn-accent" type="button" @click="openTransactionModal">
            <SvgIcon name="plus" class-name="icon--inline me-2" />Добавить транзакцию
          </button>
          <button class="btn btn-outline-dark" type="button" @click="openBudgetModal">
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
                :loading="filterLoading"
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
          <button type="button" class="btn-close" aria-label="Закрыть" @click="closeActionModal"></button>
        </div>
        <div class="modal-body">
          <form class="row g-3" @submit.prevent="submitAction">
            <template v-if="actionModal.mode === 'transaction'">
              <div class="col-12">
                <label class="form-label" for="transactionTitle">Название</label>
                <input id="transactionTitle" v-model.trim="transactionForm.title" class="form-control" type="text" placeholder="Например, Кофе" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="transactionCategory">Категория</label>
                <select id="transactionCategory" v-model="transactionForm.category" class="form-select">
                  <option>Еда</option>
                  <option>Транспорт</option>
                  <option>Дом</option>
                  <option>Подписки</option>
                  <option>Доход</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="transactionType">Тип</label>
                <select id="transactionType" v-model="transactionForm.type" class="form-select">
                  <option value="expense">Расход</option>
                  <option value="income">Доход</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="transactionAmount">Сумма</label>
                <input id="transactionAmount" v-model="transactionForm.amount" class="form-control" type="number" min="1" step="1" placeholder="2500" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="transactionDate">Дата</label>
                <input id="transactionDate" v-model="transactionForm.date" class="form-control" type="date" required />
              </div>
              <div class="col-12">
                <label class="form-label" for="transactionAccount">Счет</label>
                <select id="transactionAccount" v-model="transactionForm.accountName" class="form-select">
                  <option v-for="account in accounts" :key="account.id">{{ account.name }}</option>
                </select>
              </div>
            </template>

            <template v-else>
              <div class="col-12">
                <label class="form-label" for="budgetCategory">Категория</label>
                <input id="budgetCategory" v-model.trim="budgetForm.category" class="form-control" type="text" placeholder="Например, Книги" required />
              </div>
              <div class="col-12">
                <label class="form-label" for="budgetLimit">Лимит</label>
                <input id="budgetLimit" v-model="budgetForm.limit" class="form-control" type="number" min="1" step="1" placeholder="5000" required />
              </div>
            </template>

            <div v-if="actionModal.error" class="col-12">
              <div class="alert alert-danger mb-0" role="alert">{{ actionModal.error }}</div>
            </div>
            <div class="col-12 d-flex gap-2">
              <button type="button" class="btn btn-outline-dark w-50" @click="closeActionModal">Отмена</button>
              <button type="submit" class="btn btn-accent w-50" :disabled="actionModal.busy">
                {{ actionModal.busy ? "Сохраняем..." : "Сохранить" }}
              </button>
            </div>
          </form>
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
import { apiRequest } from "@/services/api";
import { buildBudgetPayload, buildTransactionPayload } from "@/utils/dashboardActions";
import { buildDashboardSummary } from "@/utils/financeMetrics";
import { sortTransactions } from "@/utils/financeMetrics";
import { formatCurrency, formatDate } from "@/utils/formatters";

const auth = useAuth();
const {
  accounts,
  budgets,
  transactions,
  loading,
  error,
  loadDashboardData,
} = useFinanceData();
const userId = computed(() => auth.session.value?.user?.id ?? null);
const { filters, categories, filteredTransactions, filterLoading, resetFilters } = useTransactionsFilter(transactions, userId);
const actionModal = reactive({
  open: false,
  mode: "transaction",
  title: "",
  busy: false,
  error: "",
});
const transactionForm = reactive({
  title: "",
  category: "Еда",
  amount: "",
  type: "expense",
  accountName: "",
  provider: "manual",
  date: formatDate(new Date()),
});
const budgetForm = reactive({
  category: "",
  limit: "",
});

const summary = computed(() => buildDashboardSummary({
  user: auth.session.value?.user,
  accounts: accounts.value,
  budgets: budgets.value,
  transactions: transactions.value,
}));

function openTransactionModal() {
  resetTransactionForm();
  actionModal.mode = "transaction";
  actionModal.title = "Добавить транзакцию";
  actionModal.error = "";
  actionModal.open = true;
}

function openBudgetModal() {
  resetBudgetForm();
  actionModal.mode = "budget";
  actionModal.title = "Создать бюджет";
  actionModal.error = "";
  actionModal.open = true;
}

function closeActionModal() {
  actionModal.open = false;
  actionModal.busy = false;
  actionModal.error = "";
}

function resetTransactionForm() {
  transactionForm.title = "";
  transactionForm.category = "Еда";
  transactionForm.amount = "";
  transactionForm.type = "expense";
  transactionForm.accountName = accounts.value[0]?.name || "Текущий счёт";
  transactionForm.provider = "manual";
  transactionForm.date = formatDate(new Date());
}

function resetBudgetForm() {
  budgetForm.category = "";
  budgetForm.limit = "";
}

async function submitAction() {
  actionModal.busy = true;
  actionModal.error = "";

  try {
    const currentSession = await auth.ensureSession();

    if (actionModal.mode === "transaction") {
      const created = await apiRequest("/transactions", {
        method: "POST",
        body: buildTransactionPayload(transactionForm, currentSession.user.id),
      });
      transactions.value = sortTransactions([created, ...transactions.value]);
    } else {
      const created = await apiRequest("/budgets", {
        method: "POST",
        body: buildBudgetPayload(budgetForm, currentSession.user.id),
      });
      budgets.value = [created, ...budgets.value];
    }

    closeActionModal();
  } catch (requestError) {
    actionModal.error = requestError.message || "Не удалось сохранить данные.";
  } finally {
    actionModal.busy = false;
  }
}

onMounted(loadDashboardData);
</script>
