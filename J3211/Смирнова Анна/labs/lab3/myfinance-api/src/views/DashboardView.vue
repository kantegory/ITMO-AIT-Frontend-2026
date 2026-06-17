<template>
  <AppLayout>
    <template #header="{ toggleSidebar }">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <button class="btn btn-light d-lg-none me-2" @click="toggleSidebar" aria-expanded="false" aria-controls="sidebar" aria-label="Открыть меню">
            <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-list"></use></svg>
          </button>
          <h1 class="m-0 h2" id="welcome-msg">Добро пожаловать, {{ user?.firstName }}!</h1>
        </div>
        <button class="btn btn-primary btn-sm px-3 py-2" @click="openModal('transaction')">
          <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-plus-lg"></use></svg> Добавить
        </button>
      </div>
    </template>

    <div v-if="!isDataLoaded" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted" aria-live="polite">Загрузка данных...</div>
    </div>

    <div v-else>
      <!-- Карточки баланса -->
      <section class="row g-3 mb-4" id="dashboard-cards" aria-label="Сводка баланса">
          <div class="col-12 col-md-4">
              <div class="card bg-primary text-white border-0 shadow-sm p-3 py-4 h-100">
                  <h2 class="card-title mb-1 text-white-75 fs-6 fw-normal">Общий баланс</h2>
                  <p class="card-text fw-bold m-0 fs-2">{{ totalBalance.toLocaleString() }} ₽</p>
              </div>
          </div>
          <div class="col-12 col-md-4">
              <div class="card bg-success text-white border-0 shadow-sm p-3 py-4 h-100">
                  <h2 class="card-title mb-1 text-white-75 fs-6 fw-normal">Доходы (в этом мес.)</h2>
                  <p class="card-text fw-bold m-0 fs-2">+ {{ monthIncome.toLocaleString() }} ₽</p>
              </div>
          </div>
          <div class="col-12 col-md-4">
              <div class="card bg-danger text-white border-0 shadow-sm p-3 py-4 h-100">
                  <h2 class="card-title mb-1 text-white-75 fs-6 fw-normal">Расходы (в этом мес.)</h2>
                  <p class="card-text fw-bold m-0 fs-2">- {{ monthExpense.toLocaleString() }} ₽</p>
              </div>
          </div>
      </section>

      <!-- Графики -->
      <div class="row g-3">
          <div class="col-12 col-lg-8">
              <section class="card border-0 shadow-sm p-3 h-100" aria-labelledby="balance-chart-title">
                  <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <h2 class="m-0 mb-2 mb-sm-0 h5" id="balance-chart-title">Динамика баланса</h2>
                      <select class="form-select form-select-sm w-auto shadow-none" v-model="chartTimeframe" aria-label="Выберите период для графика">
                          <option value="week">За эту неделю (по дням)</option>
                          <option value="month">За этот месяц (по дням)</option>
                          <option value="year">За этот год (по месяцам)</option>
                          <option value="all">За всё время (по годам)</option>
                      </select>
                  </div>
                  <div style="position: relative; height: 300px; width: 100%;">
                      <canvas ref="balanceChartCanvas" role="img" aria-label="Линейный график динамики баланса">
                          <p>Ваш браузер не поддерживает отображение графиков. Динамика баланса недоступна.</p>
                      </canvas>
                  </div>
              </section>
          </div>
          <div class="col-12 col-lg-4">
              <section class="card border-0 shadow-sm p-3 h-100" aria-labelledby="category-chart-title">
                  <h2 class="mb-3 h5" id="category-chart-title">Расходы по категориям</h2>
                  <div style="position: relative; height: 300px; width: 100%;">
                      <canvas ref="categoryChartCanvas" role="img" aria-label="Круговая диаграмма расходов по категориям">
                          <p>Ваш браузер не поддерживает отображение графиков. Распределение по категориям недоступно.</p>
                      </canvas>
                  </div>
              </section>
          </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useAuth } from '../composables/useAuth';
import { useFinanceData } from '../composables/useFinanceData';
import { useModals } from '../composables/useModals';
import { useTheme } from '../composables/useTheme';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const { user } = useAuth();
const { transactions, isDataLoaded, loadData } = useFinanceData();
const { openModal } = useModals();
const { theme } = useTheme();

const chartTimeframe = ref('month');
const balanceChartCanvas = ref(null);
const categoryChartCanvas = ref(null);
let balChartInstance = null;
let catChartInstance = null;

const totalBalance = computed(() => {
    return transactions.value.reduce((acc, t) => {
        if (t.type === 'income') return acc + t.amount;
        if (t.type === 'expense' || t.type === 'savings') return acc - t.amount;
        return acc;
    }, 0);
});

const monthIncome = computed(() => {
    const now = new Date();
    return transactions.value.filter(t => {
        const d = new Date(t.date);
        return t.type === 'income' && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).reduce((acc, t) => acc + t.amount, 0);
});

const monthExpense = computed(() => {
    const now = new Date();
    return transactions.value.filter(t => {
        const d = new Date(t.date);
        return (t.type === 'expense' || t.type === 'savings') && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).reduce((acc, t) => acc + t.amount, 0);
});

const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff)).setHours(0,0,0,0);
};
const getEndOfWeek = (date) => {
    const start = new Date(getStartOfWeek(date));
    return new Date(start.setDate(start.getDate() + 6)).setHours(23,59,59,999);
};

const renderCharts = () => {
    if (!balanceChartCanvas.value || !categoryChartCanvas.value) return;

    const chartTextColor = theme.value === 'dark' ? '#adb5bd' : '#6c757d';
    const chartGridColor = theme.value === 'dark' ? '#333333' : '#e9ecef';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let labels = [], netFlows = [], initialBalance = 0, expensesByCategory = {};

    if (chartTimeframe.value === 'week') {
        labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        netFlows = Array(7).fill(0);
        const startOfWeek = getStartOfWeek(now);
        const endOfWeek = getEndOfWeek(now);

        transactions.value.forEach(t => {
            const d = new Date(t.date).getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;
            if (d < startOfWeek) initialBalance += amount;
            else if (d >= startOfWeek && d <= endOfWeek) {
                let dayIndex = new Date(t.date).getDay() - 1;
                if (dayIndex === -1) dayIndex = 6;
                netFlows[dayIndex] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (chartTimeframe.value === 'month') {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getTime();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
        netFlows = Array(daysInMonth).fill(0);

        transactions.value.forEach(t => {
            const dObj = new Date(t.date);
            const d = dObj.getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;

            if (d < firstDayOfMonth) initialBalance += amount;
            else if (dObj.getFullYear() === currentYear && dObj.getMonth() === currentMonth) {
                netFlows[dObj.getDate() - 1] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (chartTimeframe.value === 'year') {
        const firstDayOfYear = new Date(currentYear, 0, 1).getTime();
        labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        netFlows = Array(12).fill(0);

        transactions.value.forEach(t => {
            const dObj = new Date(t.date);
            const d = dObj.getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;

            if (d < firstDayOfYear) initialBalance += amount;
            else if (dObj.getFullYear() === currentYear) {
                netFlows[dObj.getMonth()] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (chartTimeframe.value === 'all') {
        const years = [...new Set(transactions.value.map(t => new Date(t.date).getFullYear()))].sort();
        labels = years.length ? years.map(String) : [currentYear.toString()];
        netFlows = Array(labels.length).fill(0);

        transactions.value.forEach(t => {
            const y = new Date(t.date).getFullYear().toString();
            const idx = labels.indexOf(y);
            const amount = t.type === 'income' ? t.amount : -t.amount;
            if (idx !== -1) {
                netFlows[idx] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    }

    Object.keys(expensesByCategory).forEach(cat => {
        if (expensesByCategory[cat] <= 0) delete expensesByCategory[cat];
    });

    let cumulativeData = [];
    let currentBal = initialBalance;
    for (let i = 0; i < labels.length; i++) {
        currentBal += netFlows[i];
        cumulativeData.push(currentBal);
    }

    if (balChartInstance) balChartInstance.destroy();
    balChartInstance = new Chart(balanceChartCanvas.value.getContext('2d'), {
        type: 'line',
        data: { labels, datasets: [{ label: 'Баланс (₽)', data: cumulativeData, borderColor: '#0d6efd', backgroundColor: 'rgba(13, 110, 253, 0.1)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 3 }] },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            scales: { 
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                y: { beginAtZero: false, ticks: { color: chartTextColor }, grid: { color: chartGridColor } } 
            }, 
            plugins: { datalabels: { display: false } } 
        }
    });

    if (catChartInstance) catChartInstance.destroy();
    const catLabels = Object.keys(expensesByCategory);
    const catData = Object.values(expensesByCategory);
    catChartInstance = new Chart(categoryChartCanvas.value.getContext('2d'), {
        type: 'doughnut',
        data: { 
            labels: catLabels.length ? catLabels : ['Нет данных'], 
            datasets: [{ data: catData.length ? catData : [1], backgroundColor: catData.length ? ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d', '#0dcaf0', '#8a2be2', '#ff7f50'] : ['#e9ecef'] }] 
        },
        options: { 
            responsive: true, maintainAspectRatio: false, cutout: '60%', 
            plugins: { 
                datalabels: { display: false },
                legend: { labels: { color: chartTextColor } }
            } 
        }
    });
};

onMounted(() => {
    if (!isDataLoaded.value) {
        loadData();
    } else {
        renderCharts();
    }
});

watch([isDataLoaded, chartTimeframe, theme], () => {
    if (isDataLoaded.value) {
        setTimeout(renderCharts, 0);
    }
});
</script>