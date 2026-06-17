<template>
  <BaseLayout>
    <div class="container">
      <div class="dashboard-block">
        <h2 class="block-title">&gt; ПЕРИОД_ОТЧЁТА</h2>
        <div class="row g-2">

          <div class="col-md-5">
            <div class="input-group mb-0">
              <label class="input-prefix" for="reportMonth">МЕСЯЦ:</label>
              <select id="reportMonth" v-model="reportMonth" class="terminal-input">
                <option v-for="(m, i) in months" :key="i" :value="i+1">{{ m }}</option>
              </select>
            </div>
          </div>

          <div class="col-md-5">
            <div class="input-group mb-0">
              <label class="input-prefix" for="reportYear">ГОД:</label>
              <select id="reportYear" v-model="reportYear" class="terminal-input">
                <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <div class="col-md-2">
            <button @click="buildReport" class="terminal-btn mt-0" style="width: 100%;">[ ОБНОВИТЬ ]</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; ДИНАМИКА_БАЛАНСА</h2>
            <div style="height: 300px;">
              <canvas ref="chartCanvas" aria-label="График динамики баланса" role="img"></canvas>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="dashboard-block" style="min-height: 342px;">
            <h2 class="block-title">&gt; ПРОГНОЗ</h2>
            <div v-if="stats.count > 0">
              ДОХОДЫ: <span class="text-income">{{ stats.income.toFixed(2) }}</span><br>
              РАСХОДЫ: <span class="text-expense">{{ stats.expense.toFixed(2) }}</span><br>
              ИТОГ: <b>{{ (stats.income - stats.expense).toFixed(2) }}</b>
              <hr>
              ПРОГНОЗ ОСТАТКА: <br>
              <b :class="stats.projRem >= 0 ? 'text-income' : 'text-expense'">{{ stats.projRem.toFixed(2) }} RUB</b>
            </div>
            <div v-else>ДАННЫХ НЕТ</div>
            <h2 class="block-title mt-4">&gt; ОСТАТОК_ОТ_ДОХОДА</h2>
            <div class="progress" style="height: 35px;">
              <div class="progress-bar" :class="stats.projRem >= 0 ? 'bg-income' : 'bg-expense'"
                   :style="{ width: stats.percent + '%' }">{{ stats.percent }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; АНАЛИЗ_ДОХОДОВ</h2>
            <StatProgressBar
                v-for="(val, cat) in stats.incByCat"
                :key="cat"
                :label="cat"
                :percent="Math.round(val/stats.income*100)"
                colorClass="bg-income"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; АНАЛИЗ_РАСХОДОВ</h2>
            <StatProgressBar
                v-for="(val, cat) in stats.expByCat"
                :key="cat"
                :label="cat"
                :percent="Math.round(val/stats.expense*100)"
                colorClass="bg-expense"
            />
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import Chart from 'chart.js/auto'
import BaseLayout from '../layouts/BaseLayout.vue'
import {useFinanceStore} from '../stores/finance'
import {useAuthStore} from '../stores/auth'
import StatProgressBar from "@/components/StatProgressBar.vue";

const financeStore = useFinanceStore()
const authStore = useAuthStore()

const chartCanvas = ref(null)
let chartInstance = null
const reportMonth = ref(new Date().getMonth() + 1)
const reportYear = ref(new Date().getFullYear())
const months = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ']

const stats = ref({
  income: 0,
  expense: 0,
  incByCat: {},
  expByCat: {},
  projRem: 0,
  percent: 0,
  count: 0
})

const availableYears = computed(() => {
  const years = [...new Set(financeStore.transactions.map(t => parseInt(t.date.split('-')[0])))]
  return years.length ? years.sort() : [new Date().getFullYear()]
})

const buildReport = () => {
  const filtered = financeStore.transactions.filter(t => {
    const d = t.date.split('-')
    return parseInt(d[0]) === reportYear.value && parseInt(d[1]) === reportMonth.value
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const s = {
    income: 0,
    expense: 0,
    incByCat: {},
    expByCat: {},
    count: filtered.length
  }
  filtered.forEach(t => {
    if (t.sum > 0) {
      s.income += t.sum;
      s.incByCat[t.category] = (s.incByCat[t.category] || 0) + t.sum
    } else {
      s.expense += Math.abs(t.sum);
      s.expByCat[t.category] = (s.expByCat[t.category] || 0) + Math.abs(t.sum)
    }
  })

  s.projRem = s.income - s.expense
  s.percent = s.income > 0 ? Math.max(0, Math.round(((s.income - s.expense) / s.income) * 100)) : 0
  stats.value = s

  if (chartInstance) chartInstance.destroy()
  let runSum = 0
  const color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: filtered.map(t => t.date.split('-')[2]),
      datasets: [{
        data: filtered.map(t => {
          runSum += t.sum;
          return runSum
        }), borderColor: color, stepped: true, fill: false
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {legend: {display: false}}
    }
  })
}

onMounted(async () => {
  await financeStore.loadAllData(authStore.userId)
  buildReport()
})
</script>