<template>
  <main class="container">
    <h1 class="fw-bold h3 mb-4">Аналитический отчет</h1>

    <div class="row g-4 mb-5">
      <div class="col-lg-6">
        <section class="card p-4 shadow-sm border-0 h-100">
          <h2 class="text-muted small fw-bold text-uppercase h6 mb-4">Расходы по категориям</h2>
          <div class="chart-box-fixed">
            <canvas ref="catChartRef" role="img" aria-label="Диаграмма расходов"></canvas>
          </div>
        </section>
      </div>

      <div class="col-lg-6">
        <section class="card p-4 shadow-sm border-0 h-100">
          <h2 class="text-muted small fw-bold text-uppercase h6 mb-4">Доходы и расходы по месяцам</h2>
          <div class="chart-box-fixed">
            <canvas ref="monthChartRef" role="img" aria-label="Динамика по месяцам"></canvas>
          </div>
        </section>
      </div>

      <div class="col-lg-12">
        <div class="card p-5 bg-dark text-white border-0 shadow-sm text-center">
          <h2 class="fw-bold mb-2 opacity-75 text-uppercase small h6">Ожидаемый баланс к концу месяца</h2>
          <div class="display-3 fw-bold mb-0">
            {{ Math.round(forecastValue).toLocaleString() }} ₽
          </div>
          <p class="mt-3 mb-0 opacity-50 small">
            Расчет произведен на основе средних трат в текущем календарном периоде
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import {useTransactions} from '../composables/useTransactions'
import Chart from 'chart.js/auto'

const {transactions, fetchTransactions} = useTransactions()
const catChartRef = ref(null)
const monthChartRef = ref(null)
let chart1 = null
let chart2 = null

const forecastValue = computed(() => {
  if (transactions.value.length === 0) return 0

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentDay = now.getDate()

  const totalBalance = transactions.value.reduce((acc, t) =>
      t.type === 'plus' ? acc + parseFloat(t.sum) : acc - parseFloat(t.sum), 0
  )

  const monthExpenses = transactions.value
      .filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'minus'
      })
      .reduce((acc, t) => acc + parseFloat(t.sum), 0)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const dailyAvg = monthExpenses / currentDay
  const remainingDays = daysInMonth - currentDay

  return totalBalance - (dailyAvg * remainingDays)
})

const renderCharts = () => {
  if (!catChartRef.value || !monthChartRef.value) return

  if (chart1) chart1.destroy()
  if (chart2) chart2.destroy()

  const cats = {}
  transactions.value.filter(t => t.type === 'minus').forEach(t => {
    cats[t.cat] = (cats[t.cat] || 0) + parseFloat(t.sum)
  })

  chart1 = new Chart(catChartRef.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: ['#4e54c8', '#6c7d9f', '#2d3748', '#a3b1c6', '#8f94fb', '#4a5568'],
        borderWidth: 2,
        borderColor: document.body.classList.contains('dark-theme') ? '#1a1f2e' : '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {color: getComputedStyle(document.body).getPropertyValue('--text-body')}
        }
      }
    }
  })

  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const monthlyData = {}

  transactions.value.forEach(t => {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!monthlyData[key]) monthlyData[key] = {income: 0, expense: 0, label: months[d.getMonth()]}
    if (t.type === 'plus') monthlyData[key].income += parseFloat(t.sum)
    else monthlyData[key].expense += parseFloat(t.sum)
  })

  const sortedKeys = Object.keys(monthlyData).sort()

  chart2 = new Chart(monthChartRef.value, {
    type: 'bar',
    data: {
      labels: sortedKeys.map(k => monthlyData[k].label),
      datasets: [
        {label: 'Доходы', data: sortedKeys.map(k => monthlyData[k].income), backgroundColor: '#6c7d9f'},
        {label: 'Траты', data: sortedKeys.map(k => monthlyData[k].expense), backgroundColor: '#2d3748'}
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {color: getComputedStyle(document.body).getPropertyValue('--text-body')}
        }
      }
    }
  })
}

onMounted(async () => {
  await fetchTransactions()
  renderCharts()
})

watch(transactions, renderCharts, {deep: true})
</script>