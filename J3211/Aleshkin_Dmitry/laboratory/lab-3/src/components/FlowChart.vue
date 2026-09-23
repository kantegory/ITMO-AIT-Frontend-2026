<template>
  <div class="chart-box">
    <h2 class="mb-3">Движение средств по дням</h2>

    <div v-if="!flow?.labels?.length" class="empty-state">
      Пока недостаточно данных для графика движения средств.
    </div>

    <div v-else class="chart-canvas-wrap">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  flow: {
    type: Object,
    required: true,
  },
});

const canvasRef = ref(null);
let chartInstance = null;
let themeObserver = null;

function readCssVar(name, fallback = '') {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function getChartColors() {
  return {
    text: readCssVar('--chart-text', '#14213d'),
    grid: readCssVar('--chart-grid', 'rgba(82, 108, 168, 0.25)'),
    incomeBg: readCssVar('--chart-income-bg', 'rgba(22, 153, 87, 0.5)'),
    incomeBorder: readCssVar('--chart-income-border', '#159957'),
    expenseBg: readCssVar('--chart-expense-bg', 'rgba(217, 75, 75, 0.5)'),
    expenseBorder: readCssVar('--chart-expense-border', '#d94b4b'),
  };
}

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (canvasRef.value) {
    const existingChart = Chart.getChart(canvasRef.value);
    if (existingChart) {
      existingChart.destroy();
    }
  }
}

async function renderChart() {
  await nextTick();

  if (!canvasRef.value || !props.flow?.labels?.length) {
    destroyChart();
    return;
  }

  destroyChart();

  const colors = getChartColors();

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.flow.labels,
      datasets: [
        {
          label: 'Доходы, ₽',
          data: props.flow.income || [],
          backgroundColor: colors.incomeBg,
          borderColor: colors.incomeBorder,
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Расходы, ₽',
          data: props.flow.expenses || [],
          backgroundColor: colors.expenseBg,
          borderColor: colors.expenseBorder,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            color: colors.text,
          },
          grid: {
            color: colors.grid,
          },
          border: {
            color: colors.grid,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Сумма, ₽',
            color: colors.text,
            font: {
              weight: 'bold',
            },
          },
          ticks: {
            color: colors.text,
            callback(value) {
              return `${Number(value).toLocaleString('ru-RU')} ₽`;
            },
          },
          grid: {
            color: colors.grid,
          },
          border: {
            color: colors.grid,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.raw || 0).toLocaleString('ru-RU');
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
      },
    },
  });
}

watch(() => props.flow, renderChart, { deep: true });

onMounted(() => {
  renderChart();

  themeObserver = new MutationObserver(() => {
    renderChart();
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onBeforeUnmount(() => {
  destroyChart();

  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
});
</script>