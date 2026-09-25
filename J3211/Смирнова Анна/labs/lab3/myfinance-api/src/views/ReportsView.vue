<template>
  <AppLayout>
    <template #header="{ toggleSidebar }">
        <div class="d-flex align-items-center mb-4">
            <button class="btn btn-light d-lg-none me-2" @click="toggleSidebar" aria-expanded="false" aria-controls="sidebar" aria-label="Открыть меню">
                <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-list"></use></svg>
            </button>
            <h1 class="m-0 h2">Детальные отчеты</h1>
        </div>
    </template>

    <div v-if="!isDataLoaded" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted" aria-live="polite">Загрузка данных...</div>
    </div>

    <div v-else class="row">
        <div class="col-12">
            <section class="card border-0 shadow-sm p-4 h-100" aria-labelledby="reports-heading">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <h2 id="reports-heading" class="m-0 mb-2 mb-sm-0 h5">Сравнение: Доходы и Расходы</h2>
                    <select class="form-select form-select-sm w-auto shadow-none" v-model="timeframe" aria-label="Выберите период для отчета">
                        <option value="month">За этот месяц (по дням)</option>
                        <option value="year">За этот год (по месяцам)</option>
                        <option value="all">За всё время (по годам)</option>
                    </select>
                </div>
                <div class="text-muted small mb-3">
                    <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-info-circle"></use></svg> Нажмите на "Доходы" или "Расходы" в легенде ниже, чтобы скрыть или показать линию.
                </div>
                <div style="height: 400px; position: relative; width: 100%;">
                    <canvas ref="reportsChartCanvas" role="img" aria-label="Линейный график сравнения доходов и расходов">
                        <p>Ваш браузер не поддерживает отображение графиков. Информация о сравнении доходов и расходов недоступна.</p>
                    </canvas>
                </div>
            </section>
        </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useFinanceData } from '../composables/useFinanceData';
import { useTheme } from '../composables/useTheme';
import Chart from 'chart.js/auto';

const { transactions, isDataLoaded, loadData } = useFinanceData();
const { theme } = useTheme();

const timeframe = ref('month');
const reportsChartCanvas = ref(null);
let reportsChartInstance = null;

const formatChartLabel = (value) => {
    if (value === 0) return null;
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value;
};

const renderChart = () => {
    if (!reportsChartCanvas.value) return;

    const chartTextColor = theme.value === 'dark' ? '#adb5bd' : '#6c757d';
    const chartGridColor = theme.value === 'dark' ? '#333333' : '#e9ecef';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let labels = [], incData = [], expData = [];

    if (timeframe.value === 'month') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
        incData = Array(daysInMonth).fill(0);
        expData = Array(daysInMonth).fill(0);
        
        transactions.value.forEach(t => {
            const d = new Date(t.date);
            if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
                if(t.type === 'income') incData[d.getDate() - 1] += t.amount;
                if(t.type === 'expense' || t.type === 'savings') expData[d.getDate() - 1] += t.amount;
            }
        });
    } else if (timeframe.value === 'year') {
        labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        incData = Array(12).fill(0);
        expData = Array(12).fill(0);
        
        transactions.value.forEach(t => {
            const d = new Date(t.date);
            if (d.getFullYear() === currentYear) {
                if(t.type === 'income') incData[d.getMonth()] += t.amount;
                if(t.type === 'expense' || t.type === 'savings') expData[d.getMonth()] += t.amount;
            }
        });
    } else if (timeframe.value === 'all') {
        const years = [...new Set(transactions.value.map(t => new Date(t.date).getFullYear()))].sort();
        labels = years.length ? years.map(String) : [currentYear.toString()];
        let yearInc = {}, yearExp = {};
        
        years.forEach(y => { yearInc[y] = 0; yearExp[y] = 0; });
        
        transactions.value.forEach(t => {
            const y = new Date(t.date).getFullYear();
            if(t.type === 'income') yearInc[y] += t.amount;
            if(t.type === 'expense' || t.type === 'savings') yearExp[y] += t.amount;
        });
        
        incData = labels.map(l => yearInc[l] || 0);
        expData = labels.map(l => yearExp[l] || 0);
    }

    if (reportsChartInstance) reportsChartInstance.destroy();
    
    reportsChartInstance = new Chart(reportsChartCanvas.value.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Доходы (₽)', data: incData, borderColor: '#198754', backgroundColor: 'rgba(25, 135, 84, 0.2)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4 },
                { label: 'Расходы (₽)', data: expData, borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.2)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4 }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            interaction: { mode: 'index', intersect: false }, 
            scales: { 
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                y: { beginAtZero: true, ticks: { color: chartTextColor }, grid: { color: chartGridColor } } 
            }, 
            plugins: { 
                legend: { position: 'top', labels: { color: chartTextColor, usePointStyle: true, padding: 20 } }, 
                datalabels: { 
                    backgroundColor: (c) => c.dataset.borderColor, 
                    borderRadius: 4, 
                    color: 'white', 
                    font: { weight: 'bold', size: 11 }, 
                    formatter: formatChartLabel, 
                    padding: { top: 3, bottom: 3, left: 6, right: 6 }, 
                    align: 'top', 
                    offset: 4 
                } 
            } 
        }
    });
};

onMounted(() => {
    if (!isDataLoaded.value) {
        loadData();
    } else {
        renderChart();
    }
});

watch([isDataLoaded, timeframe, theme], () => {
    if (isDataLoaded.value) {
        setTimeout(renderChart, 0);
    }
});
</script>