<template>
  <div class="report-chart">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  labels: { type: Array, required: true },
  expenses: { type: Array, required: true },
  incomes: { type: Array, required: true }
})

const canvas = ref(null)
let chart = null

function render() {
  if (chart) chart.destroy()
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        { label: 'Расходы', data: props.expenses, backgroundColor: '#6bc918', borderRadius: 4 },
        { label: 'Доходы', data: props.incomes, backgroundColor: '#d4ee5e', borderRadius: 4 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { font: { size: 11 } } } },
      scales: {
        y: { beginAtZero: true, ticks: { font: { size: 11 } } },
        x: { ticks: { font: { size: 11 } } }
      }
    }
  })
}

onMounted(render)
watch(() => [props.labels, props.expenses, props.incomes], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>
