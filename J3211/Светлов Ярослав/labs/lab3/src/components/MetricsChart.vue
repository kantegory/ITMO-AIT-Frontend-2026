<template><div class="chart-container mb-3"><canvas ref="canvas" role="img" aria-label="Accuracy и loss по эпохам; значения приведены в таблице ниже" /></div></template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';
const props = defineProps({ metrics: { type: Object, required: true } });
const canvas = ref(null);
let chart;
function theme() {
  if (!chart) return;
  const css = getComputedStyle(document.documentElement);
  const color = name => css.getPropertyValue(name).trim();
  chart.data.datasets[0].borderColor = color('--chart-accuracy');
  chart.data.datasets[1].borderColor = color('--chart-loss');
  chart.options.plugins.legend.labels.color = color('--page-text');
  for (const axis of Object.values(chart.options.scales)) { axis.ticks.color = color('--page-text'); axis.grid.color = color('--chart-grid'); }
  chart.update('none');
}
onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'line', data: { labels: props.metrics.labels, datasets: [
      { label: 'Accuracy', data: props.metrics.accuracy, yAxisID: 'accuracy' },
      { label: 'Loss', data: props.metrics.loss, yAxisID: 'loss' }
    ] }, options: { responsive: true, maintainAspectRatio: false, animation: false, events: [],
      scales: { accuracy: { min: 0, max: 1 }, loss: { position: 'right', min: 0, grid: { drawOnChartArea: false } } }
    }
  });
  theme(); window.addEventListener('themechange', theme);
});
onBeforeUnmount(() => { window.removeEventListener('themechange', theme); chart?.destroy(); });
</script>
