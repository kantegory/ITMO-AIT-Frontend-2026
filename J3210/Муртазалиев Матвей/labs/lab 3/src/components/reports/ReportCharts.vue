<template>
  <div class="row g-4 mt-2">
    <div class="col-xl-8">
      <div class="content-card chart-card h-100">
        <div class="content-card__head">
          <div>
            <span class="section-label">Динамика</span>
            <h2 class="h3 mt-2 mb-0">Расходы за период</h2>
          </div>
        </div>
        <div class="chart-frame">
          <canvas ref="spendCanvas" aria-label="Линейный график расходов" role="img"></canvas>
        </div>
        <p class="visually-hidden">
          Линейный график расходов за период «{{ preset.periodLabel }}». Траты: {{ preset.spend }}. Основная категория: {{ preset.category }}.
        </p>
      </div>
    </div>

    <div class="col-xl-4">
      <div class="content-card chart-card h-100">
        <span class="section-label">Категории</span>
        <h2 class="h3 mt-2 mb-0">Структура расходов</h2>
        <div class="chart-frame chart-frame--small">
          <canvas ref="categoryCanvas" aria-label="Круговая диаграмма категорий" role="img"></canvas>
        </div>
        <div class="insight-list mt-3" role="list">
          <div v-for="(label, index) in preset.categoryLabels" :key="label" class="insight-row" role="listitem">
            <span>{{ label }}</span>
            <strong>{{ formatCurrency(preset.categoryData[index]) }}</strong>
          </div>
        </div>
        <p v-if="!preset.categoryLabels.length" class="text-secondary mt-3 mb-0">Данные по категориям пока отсутствуют.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { formatCurrency } from "@/utils/formatters";

Chart.register(...registerables);

const props = defineProps({
  preset: {
    type: Object,
    required: true,
  },
});

const spendCanvas = ref(null);
const categoryCanvas = ref(null);
let spendChart;
let categoryChart;

function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;

  return {
    line: read("--chart-line", "#2476ff"),
    fill: read("--chart-fill", "rgba(36, 118, 255, 0.16)"),
    point: read("--chart-point", "#19a991"),
    grid: read("--chart-grid", "rgba(95, 108, 123, 0.18)"),
    text: read("--chart-text", "#425160"),
    donut: [
      read("--chart-donut-1", "#2476ff"),
      read("--chart-donut-2", "#19a991"),
      read("--chart-donut-3", "#ff9b54"),
      read("--chart-donut-4", "#855dff"),
      read("--chart-donut-5", "#8694a8"),
    ],
  };
}

function createCharts() {
  const palette = readPalette();

  if (spendCanvas.value) {
    spendChart = new Chart(spendCanvas.value, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Расходы",
          data: [],
          fill: true,
          borderWidth: 3,
          borderColor: palette.line,
          backgroundColor: palette.fill,
          tension: 0.35,
          pointBackgroundColor: palette.point,
          pointRadius: 4,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: palette.grid },
            ticks: { color: palette.text },
          },
          x: {
            grid: { display: false },
            ticks: { color: palette.text },
          },
        },
      },
    });
  }

  if (categoryCanvas.value) {
    categoryChart = new Chart(categoryCanvas.value, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderWidth: 0,
          backgroundColor: palette.donut,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 12, usePointStyle: true, color: palette.text },
          },
        },
        cutout: "68%",
      },
    });
  }

  updateCharts();
}

function updateCharts() {
  if (!spendChart || !categoryChart) return;

  const palette = readPalette();
  spendChart.data.labels = props.preset.spendLabels;
  spendChart.data.datasets[0].data = props.preset.spendData;
  spendChart.data.datasets[0].borderColor = palette.line;
  spendChart.data.datasets[0].backgroundColor = palette.fill;
  spendChart.data.datasets[0].pointBackgroundColor = palette.point;
  spendChart.options.scales.y.grid.color = palette.grid;
  spendChart.options.scales.y.ticks.color = palette.text;
  spendChart.options.scales.x.ticks.color = palette.text;

  categoryChart.data.labels = props.preset.categoryLabels;
  categoryChart.data.datasets[0].data = props.preset.categoryData;
  categoryChart.data.datasets[0].backgroundColor = palette.donut;
  categoryChart.options.plugins.legend.labels.color = palette.text;

  spendChart.update();
  categoryChart.update();
}

onMounted(async () => {
  await nextTick();
  createCharts();
  document.addEventListener("finflow:themechange", updateCharts);
});

onBeforeUnmount(() => {
  document.removeEventListener("finflow:themechange", updateCharts);
  spendChart?.destroy();
  categoryChart?.destroy();
});

watch(() => props.preset, updateCharts, { deep: true });
</script>

