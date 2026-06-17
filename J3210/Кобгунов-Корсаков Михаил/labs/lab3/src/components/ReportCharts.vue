<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const expensesCanvas = ref(null);
const categoriesCanvas = ref(null);

const income = computed(() => {
  return props.transactions
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);
});

const expenses = computed(() => {
  return props.transactions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
});

const forecast = computed(() => income.value - expenses.value);

function getDailyExpenses() {
  const result = {};

  props.transactions.forEach((item) => {
    if (item.amount < 0) {
      result[item.date] = (result[item.date] || 0) + Math.abs(item.amount);
    }
  });

  return result;
}

function getCategoryExpenses() {
  const result = {};

  props.transactions.forEach((item) => {
    if (item.amount < 0) {
      result[item.category] = (result[item.category] || 0) + Math.abs(item.amount);
    }
  });

  return result;
}

onMounted(async () => {
  await nextTick();

  const dailyExpenses = getDailyExpenses();
  const categoryExpenses = getCategoryExpenses();

  new Chart(expensesCanvas.value, {
    type: 'bar',
    data: {
      labels: Object.keys(dailyExpenses),
      datasets: [{
        label: 'Расходы, ₽',
        data: Object.values(dailyExpenses)
      }]
    },
    options: {
      responsive: true,
      events: []
    }
  });

  new Chart(categoriesCanvas.value, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryExpenses),
      datasets: [{
        data: Object.values(categoryExpenses)
      }]
    },
    options: {
      responsive: true,
      events: []
    }
  });
});
</script>

<template>
  <div>
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm p-3 h-100">
          <h3 class="fs-6 text-muted">Доходы за месяц</h3>
          <p class="h3 text-success mb-0">{{ income }} ₽</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-sm p-3 h-100">
          <h3 class="fs-6 text-muted">Расходы за месяц</h3>
          <p class="h3 text-danger mb-0">{{ expenses }} ₽</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-sm p-3 h-100">
          <h3 class="fs-6 text-muted">Прогноз до конца месяца</h3>
          <p class="h3 text-primary mb-0">{{ forecast }} ₽</p>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header">
            <h3 class="fs-6 mb-0">Расходы по дням</h3>
          </div>
          <div class="card-body">
            <canvas ref="expensesCanvas" height="120" role="img" aria-label="Диаграмма расходов по дням" />
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <h3 class="fs-6 mb-0">Категории расходов</h3>
          </div>
          <div class="card-body">
            <canvas ref="categoriesCanvas" role="img" aria-label="Диаграмма расходов по категориям" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
