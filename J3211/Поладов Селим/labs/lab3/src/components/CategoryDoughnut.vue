<template>
  <div class="report-chart">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({ data: { type: Object, required: true } })
const canvas = ref(null)
let chart = null

const colors = ['#6bc918', '#d4ee5e', '#5a9bd5', '#e8a838', '#dc3545', '#6c757d', '#a855f7', '#ec4899']

function render() {
  if (chart) chart.destroy()
  chart = new Chart(canvas.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(props.data),
      datasets: [{
        data: Object.values(props.data),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      cutout: '60%'
    }
  })
}

onMounted(render)
watch(() => props.data, render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>
