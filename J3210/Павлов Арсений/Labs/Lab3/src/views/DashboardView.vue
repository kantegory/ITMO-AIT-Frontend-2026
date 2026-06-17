<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { useAuth } from '@/composables/useAuth';
import { useFinanceHelpers } from '@/composables/useFinanceHelpers';
import { apiRequest, normalizeErrorMessage } from '@/services/api';

const auth = useAuth();
const helpers = useFinanceHelpers();

const accounts = ref([]);
const transactions = ref([]);
const budgets = ref([]);

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const expenseForm = reactive({
  title: '',
  amount: '',
  accountId: '',
  category: 'food',
});

const expenseCategories = [
  { value: 'food', label: 'Кафе' },
  { value: 'groceries', label: 'Продукты' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'subscriptions', label: 'Подписки' },
  { value: 'other', label: 'Прочее' },
];

const monthKey = computed(() => helpers.currentMonthKey());

const totalBalance = computed(() =>
  accounts.value.reduce((sum, item) => sum + Number(item.balance || 0), 0),
);

const monthlyIncome = computed(() =>
  transactions.value
    .filter((item) => item.type === 'income' && String(item.date || '').startsWith(monthKey.value))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

const monthlyExpense = computed(() =>
  transactions.value
    .filter((item) => item.type === 'expense' && String(item.date || '').startsWith(monthKey.value))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

const monthlyFree = computed(() => monthlyIncome.value - monthlyExpense.value);

const recentTransactions = computed(() => transactions.value.slice(0, 5));

async function loadData() {
  if (!auth.user.value?.id || !auth.token.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const userId = auth.user.value.id;

    const [accountsData, transactionsData, budgetsData] = await Promise.all([
      apiRequest('/accounts', {
        token: auth.token.value,
        params: { userId, _sort: 'name', _order: 'asc' },
      }),
      apiRequest('/transactions', {
        token: auth.token.value,
        params: { userId, _sort: 'date', _order: 'desc' },
      }),
      apiRequest('/budgets', {
        token: auth.token.value,
        params: { userId, _sort: 'categoryLabel', _order: 'asc' },
      }),
    ]);

    accounts.value = Array.isArray(accountsData) ? accountsData : [];
    transactions.value = Array.isArray(transactionsData) ? transactionsData : [];
    budgets.value = Array.isArray(budgetsData) ? budgetsData : [];

    if (!expenseForm.accountId && accounts.value.length) {
      expenseForm.accountId = String(accounts.value[0].id);
    }
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

async function addExpense() {
  errorMessage.value = '';
  successMessage.value = '';

  const title = expenseForm.title.trim();
  const amount = Number(expenseForm.amount);
  const account = accounts.value.find((item) => Number(item.id) === Number(expenseForm.accountId));

  if (title.length < 2) {
    errorMessage.value = 'Введите описание операции (минимум 2 символа).';
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errorMessage.value = 'Укажите сумму больше 0.';
    return;
  }

  if (!account) {
    errorMessage.value = 'Выберите счет для списания.';
    return;
  }

  try {
    await apiRequest('/transactions', {
      method: 'POST',
      token: auth.token.value,
      body: {
        userId: auth.user.value.id,
        date: helpers.toIsoDate(new Date()),
        title,
        category: expenseForm.category,
        categoryLabel: helpers.getCategoryLabel(expenseForm.category),
        type: 'expense',
        typeLabel: helpers.getTypeLabel('expense'),
        amount,
        accountId: account.id,
        accountName: account.name,
      },
    });

    await apiRequest(`/accounts/${account.id}`, {
      method: 'PATCH',
      token: auth.token.value,
      body: {
        balance: Number(account.balance || 0) - amount,
      },
    });

    expenseForm.title = '';
    expenseForm.amount = '';
    expenseForm.category = 'food';

    successMessage.value = 'Операция добавлена.';
    await loadData();
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  }
}

onMounted(() => {
  void loadData();
});
</script>

<template>
  <section class="glass-card hero-panel mb-4 reveal">
    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
      <div>
        <h1 class="page-title">Личный кабинет</h1>
        <p class="page-subtitle mb-0">Сводка по счетам, операциям и бюджетам для пользователя {{ auth.userName.value }}.</p>
      </div>
      <RouterLink class="btn btn-outline-accent" to="/report">Открыть отчет</RouterLink>
    </div>
  </section>

  <div v-if="errorMessage" class="alert alert-danger mb-4" role="status">{{ errorMessage }}</div>
  <div v-if="successMessage" class="alert alert-success mb-4" role="status">{{ successMessage }}</div>

  <section class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3 reveal delay-1">
      <StatCard label="Общий баланс" :value="helpers.formatCurrency(totalBalance)" hint="Актуальные данные из API" tone="neutral" />
    </div>
    <div class="col-sm-6 col-xl-3 reveal delay-1">
      <StatCard
        label="Расходы текущего месяца"
        :value="helpers.formatCurrency(monthlyExpense)"
        hint="Пересчет по операциям"
        tone="negative"
      />
    </div>
    <div class="col-sm-6 col-xl-3 reveal delay-2">
      <StatCard
        label="Доходы текущего месяца"
        :value="helpers.formatCurrency(monthlyIncome)"
        hint="Пересчет по операциям"
        tone="positive"
      />
    </div>
    <div class="col-sm-6 col-xl-3 reveal delay-2">
      <StatCard
        label="Свободный остаток"
        :value="helpers.formatCurrency(monthlyFree)"
        hint="Доходы минус расходы"
        tone="neutral"
      />
    </div>
  </section>

  <section class="row g-4 align-items-start">
    <div class="col-lg-4 reveal delay-2">
      <article class="glass-card p-3 p-md-4 mb-4">
        <h2 class="section-title h5 mb-3">Добавить расход</h2>
        <div class="mb-3">
          <label class="form-label" for="quickTitle">Описание</label>
          <input id="quickTitle" v-model.trim="expenseForm.title" type="text" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="quickAmount">Сумма</label>
          <input id="quickAmount" v-model="expenseForm.amount" type="number" min="1" step="1" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="quickAccount">Счет</label>
          <select id="quickAccount" v-model="expenseForm.accountId" class="form-select">
            <option v-for="item in accounts" :key="item.id" :value="String(item.id)">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label" for="quickCategory">Категория</label>
          <select id="quickCategory" v-model="expenseForm.category" class="form-select">
            <option v-for="item in expenseCategories" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
        <button class="btn btn-accent w-100" type="button" @click="addExpense">Сохранить</button>
      </article>

      <article class="glass-card p-3 p-md-4 mb-4">
        <h2 class="section-title h5 mb-3">Счета пользователя</h2>
        <ul v-if="accounts.length" class="account-list">
          <li v-for="account in accounts" :key="account.id">
            <span>{{ account.name }}</span>
            <strong>{{ helpers.formatCurrency(account.balance) }}</strong>
          </li>
        </ul>
        <p v-else class="text-muted-custom mb-0">Счета не найдены.</p>
      </article>

      <article class="glass-card p-3 p-md-4">
        <h2 class="section-title h5 mb-3">Бюджеты по категориям</h2>
        <div v-if="budgets.length">
          <div v-for="budget in budgets" :key="budget.id" class="mb-3">
            <div class="d-flex justify-content-between mb-1">
              <span>{{ budget.categoryLabel }}</span>
              <span class="text-muted-custom">
                {{ helpers.formatCurrency(budget.current) }} / {{ helpers.formatCurrency(budget.limit) }}
              </span>
            </div>
            <div class="progress" role="progressbar" aria-label="Прогресс бюджета" aria-valuemin="0" aria-valuemax="100">
              <div
                class="progress-bar"
                :style="{ width: `${Math.max(0, Math.min(100, Math.round((Number(budget.current) / Number(budget.limit || 1)) * 100)))}%` }"
              ></div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted-custom mb-0">Бюджеты пока не заданы.</p>
      </article>
    </div>

    <div class="col-lg-8 reveal delay-3">
      <article class="glass-card p-3 p-md-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 class="section-title h5 mb-0">Последние транзакции</h2>
          <RouterLink class="btn btn-sm btn-outline-accent" to="/transactions">Все транзакции</RouterLink>
        </div>

        <div v-if="isLoading" class="text-muted-custom">Загрузка данных...</div>

        <div v-else class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Дата</th>
                <th scope="col">Описание</th>
                <th scope="col">Категория</th>
                <th scope="col" class="text-end">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!recentTransactions.length">
                <td colspan="4" class="text-center text-muted-custom py-4">Нет данных по операциям.</td>
              </tr>
              <tr v-for="item in recentTransactions" :key="item.id">
                <td data-label="Дата">{{ helpers.formatDate(item.date) }}</td>
                <td data-label="Описание">{{ item.title }}</td>
                <td data-label="Категория">
                  <span class="badge-soft" :class="helpers.getBadgeClass(item.type)">
                    {{ item.categoryLabel || helpers.getCategoryLabel(item.category) }}
                  </span>
                </td>
                <td data-label="Сумма" class="text-end">
                  {{ item.type === 'expense' ? '-' : '' }}{{ helpers.formatCurrency(item.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </section>
</template>
