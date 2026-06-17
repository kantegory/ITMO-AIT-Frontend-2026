<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import ReportChart from '@/components/ReportChart.vue';
import StatCard from '@/components/StatCard.vue';
import { useAuth } from '@/composables/useAuth';
import { useFinanceHelpers } from '@/composables/useFinanceHelpers';
import { apiRequest, normalizeErrorMessage } from '@/services/api';

const auth = useAuth();
const helpers = useFinanceHelpers();

const isLoading = ref(false);
const errorMessage = ref('');
const transactions = ref([]);
const selectedPeriod = ref('');

const periodKeys = computed(() => helpers.collectPeriodKeys(transactions.value));

watch(
  periodKeys,
  (keys) => {
    if (!keys.length) {
      selectedPeriod.value = helpers.currentMonthKey();
      return;
    }

    if (!keys.includes(selectedPeriod.value)) {
      selectedPeriod.value = keys[0];
    }
  },
  { immediate: true },
);

const monthTransactions = computed(() =>
  transactions.value.filter((item) => String(item.date || '').startsWith(selectedPeriod.value)),
);

const reportSpent = computed(() =>
  monthTransactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

const reportIncome = computed(() =>
  monthTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

const reportForecast = computed(() => helpers.calculateForecast(selectedPeriod.value, reportSpent.value));

const reportCategories = computed(() => helpers.aggregateExpenseCategories(monthTransactions.value));

async function loadTransactions() {
  if (!auth.user.value?.id || !auth.token.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await apiRequest('/transactions', {
      token: auth.token.value,
      params: {
        userId: auth.user.value.id,
        _sort: 'date',
        _order: 'desc',
      },
    });

    transactions.value = Array.isArray(data) ? data : [];
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadTransactions();
});
</script>

<template>
  <section class="glass-card hero-panel mb-4 reveal">
    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
      <div>
        <h1 class="page-title">Финансовый отчет</h1>
        <p class="page-subtitle mb-0">
          Аналитика расходов и доходов по периодам для пользователя {{ auth.userName.value }}.
        </p>
      </div>

      <div class="period-select-wrap">
        <label class="form-label" for="reportPeriod">Период</label>
        <select id="reportPeriod" v-model="selectedPeriod" class="form-select">
          <option v-for="key in periodKeys" :key="key" :value="key">
            {{ helpers.formatMonthLabel(key) }}
          </option>
        </select>
      </div>
    </div>
  </section>

  <div v-if="errorMessage" class="alert alert-danger mb-4" role="status">{{ errorMessage }}</div>

  <section class="row g-3 mb-4">
    <div class="col-md-4 reveal delay-1">
      <StatCard label="Расходы за период" :value="helpers.formatCurrency(reportSpent)" />
    </div>
    <div class="col-md-4 reveal delay-2">
      <StatCard label="Доходы за период" :value="helpers.formatCurrency(reportIncome)" />
    </div>
    <div class="col-md-4 reveal delay-2">
      <StatCard label="Прогноз расходов" :value="helpers.formatCurrency(reportForecast)" />
    </div>
  </section>

  <section class="row g-4">
    <div class="col-lg-8 reveal delay-3">
      <article class="glass-card p-3 p-md-4 h-100" aria-labelledby="chartTitle">
        <h2 id="chartTitle" class="section-title h5 mb-3">Структура расходов</h2>

        <div v-if="isLoading" class="text-muted-custom">Загрузка данных...</div>
        <ReportChart v-else :items="reportCategories" :format-value="helpers.formatCurrency" />
      </article>
    </div>

    <div class="col-lg-4 reveal delay-3">
      <article class="glass-card p-3 p-md-4 h-100" aria-labelledby="insightsTitle">
        <h2 id="insightsTitle" class="section-title h5 mb-3">Короткие выводы</h2>
        <ul class="mb-0 ps-3 d-grid gap-2">
          <li>Пик расходов приходится на повседневные категории.</li>
          <li>Расходы можно детально сверить с таблицей транзакций.</li>
          <li>Прогноз рассчитывается на основе текущего темпа трат в периоде.</li>
        </ul>
        <RouterLink class="btn btn-outline-accent mt-4" to="/transactions">Перейти к операциям</RouterLink>
      </article>
    </div>
  </section>
</template>
