<template>
  <div class="chart-box mt-4">
    <h2 class="mb-3">Расходы по категориям</h2>

    <div v-if="!normalizedItems.length" class="empty-state">
      Пока нет расходов для построения диаграммы.
    </div>

    <div v-else class="chart-canvas-wrap chart-canvas-wrap-sm">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import {
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const canvasRef = ref(null);
let chartInstance = null;
let themeObserver = null;

const normalizedItems = computed(() => {
  return props.items
    .filter((item) => Number(item.amount || 0) > 0)
    .map((item) => ({
      name: item.name || item.categoryName || item.category || 'Без категории',
      amount: Number(item.amount || 0),
    }));
});

const palette = [
  '#6272ff',
  '#159957',
  '#d94b4b',
  '#c18b13',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
];

function readCssVar(name, fallback = '') {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
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

  destroyChart();

  if (!canvasRef.value || !normalizedItems.value.length) {
    return;
  }

  const text = readCssVar('--chart-text', '#14213d');
  const border = readCssVar('--chart-surface', '#ffffff');

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: normalizedItems.value.map((item) => item.name),
      datasets: [
        {
          data: normalizedItems.value.map((item) => item.amount),
          backgroundColor: normalizedItems.value.map(
            (_, index) => palette[index % palette.length],
          ),
          borderColor: border,
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.raw || 0).toLocaleString('ru-RU');
              return `${context.label}: ${value} ₽`;
            },
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            color: text,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
      },
    },
  });
}

watch(
  normalizedItems,
  () => {
    renderChart();
  },
  { deep: true },
);

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