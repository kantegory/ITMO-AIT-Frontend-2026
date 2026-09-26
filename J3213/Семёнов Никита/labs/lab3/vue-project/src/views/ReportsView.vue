<template>
  <BaseLayout><section class="row justify-content-center" aria-labelledby="reports-heading"><div class="col-lg-8 mb-4"><div class="card shadow-sm"><div class="card-header fw-bold"><h1 id="reports-heading" class="fs-6 mb-0">Структура расходов по категориям</h1></div><div class="card-body d-flex justify-content-center"><div style="width: 100%; max-width: 500px;"><canvas ref="chartCanvas" aria-label="Круговая диаграмма расходов по категориям" role="img"></canvas></div></div></div></div></section></BaseLayout>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { transactionsApi } from '@/api'
import { useAuth } from '@/composables/useAuth'

const chartCanvas = ref(null)
let chart
const { user } = useAuth()

onMounted(async () => {
  const { data } = await transactionsApi.getByUser(user.value.id)
  const categories = {}
  data.filter((transaction) => transaction.amount < 0).forEach((transaction) => {
    categories[transaction.category] = (categories[transaction.category] || 0) + Math.abs(transaction.amount)
  })
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
  chart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: { labels: Object.keys(categories), datasets: [{ data: Object.values(categories), backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#0d6efd', '#6f42c1'], borderWidth: 2, borderColor: dark ? '#212529' : '#fff' }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: dark ? '#f8f9fa' : '#666' } } } }
  })
})

onBeforeUnmount(() => chart?.destroy())
</script>
