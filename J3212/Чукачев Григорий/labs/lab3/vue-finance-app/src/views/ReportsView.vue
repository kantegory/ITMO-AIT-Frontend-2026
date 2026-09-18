<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

const totalIncome = ref(0)
const totalExpense = ref(0)
const prevMonthExpense = ref(0)
const biggestExpense = ref({ amount: 0, title: "-", date: "" })
const categoriesData = ref({})

const analyticsState = ref({
  bgColor: '#e9ecef',
  iconClass: 'bi-hourglass-split text-secondary',
  text: 'Анализируем ваши расходы...'
})

const currentMonthName = ref('')
const loadingLimits = ref(true)
const loadingChart = ref(true)
const chartCanvas = ref(null)

const categoryLimitsData = {
  "Продукты": { limit: 30000, icon: "bi-cart" },
  "Развлечения": { limit: 40000, icon: "bi-controller" },
  "Транспорт": { limit: 15000, icon: "bi-car-front" },
  "Разное": { limit: 10000, icon: "bi-wallet2" }
}

const getLimitColorClass = (percent) => {
  if (percent >= 85) return 'bg-danger text-danger'
  if (percent >= 50) return 'bg-warning text-warning'
  return 'bg-success text-success'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' })
}

const loadReportData = async () => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let prevMonth = currentMonth - 1
  let prevYear = currentYear
  if (prevMonth < 0) {
    prevMonth = 11
    prevYear--
  }

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  currentMonthName.value = monthNames[currentMonth]

  try {
    const response = await axios.get('http://localhost:3000/transactions')
    const allTransactions = response.data

    allTransactions.forEach(tr => {
      const txDate = new Date(tr.date)
      const m = txDate.getMonth()
      const y = txDate.getFullYear()

      if (m === currentMonth && y === currentYear) {
        if (tr.type === "income") {
          totalIncome.value += tr.amount
        } else if (tr.type === "expense") {
          totalExpense.value += tr.amount
          if (tr.amount > biggestExpense.value.amount) biggestExpense.value = tr
          categoriesData.value[tr.categoryName] = (categoriesData.value[tr.categoryName] || 0) + tr.amount
        }
      }
      else if (m === prevMonth && y === prevYear) {
        if (tr.type === "expense") {
          prevMonthExpense.value += tr.amount
        }
      }
    })

    if (prevMonthExpense.value === 0) {
      analyticsState.value = {
        bgColor: '#e9ecef',
        iconClass: 'bi-info-circle-fill text-secondary',
        text: `В прошлом месяце у вас не было трат. Начинаем собирать статистику!`
      }
    } else {
      if (totalExpense.value > prevMonthExpense.value) {
        const diffPercent = Math.round(((totalExpense.value - prevMonthExpense.value) / prevMonthExpense.value) * 100)
        analyticsState.value = {
          bgColor: '#f8d7da',
          iconClass: 'bi-exclamation-triangle-fill text-danger',
          text: `В этом месяце вы потратили на <strong>${diffPercent}% больше</strong>, чем в прошлом. Пора включить режим экономии!`
        }
      } else if (totalExpense.value < prevMonthExpense.value) {
        const diffPercent = Math.round(((prevMonthExpense.value - totalExpense.value) / prevMonthExpense.value) * 100)
        analyticsState.value = {
          bgColor: '#cafad3',
          iconClass: 'bi-lightbulb-fill text-success',
          text: `Ваши расходы в этом месяце на <strong>${diffPercent}% меньше</strong>, чем в прошлом! Так держать!`
        }
      } else {
        analyticsState.value = {
          bgColor: '#fff3cd',
          iconClass: 'bi-bar-chart-fill text-warning',
          text: `Ваши расходы идут точно по графику прошлого месяца.`
        }
      }
    }

    renderChart()

  } catch (error) {
    console.error("Ошибка загрузки отчетов:", error)
  } finally {
    loadingLimits.value = false
    loadingChart.value = false
  }
}

const renderChart = () => {
  if (!chartCanvas.value) return

  if (Object.keys(categoriesData.value).length > 0) {
    const labels = Object.keys(categoriesData.value)
    const data = Object.values(categoriesData.value)
    const bgColors = ['#fdc003', '#0d6efd', '#0dcaf0', '#dc3545', '#198754', '#6c757d']

    new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 2, hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    })
  } else {
    new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: { labels: ['Пусто'], datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    })
  }
}

onMounted(() => {
  loadReportData()
})
</script>

<template>
  <main class="container mt-4">
    <h1 class="mb-4 text-success fw-bold h2"><i class="bi bi-pie-chart me-2"></i> Отчеты и аналитика</h1>

    <section id="analyticsAlert" class="alert shadow-sm border-0 d-flex align-items-center mb-4" :style="{ backgroundColor: analyticsState.bgColor, borderRadius: '15px' }">
      <i class="bi fs-3 me-3" :class="analyticsState.iconClass"></i>
      <div>
        <h2 class="alert-heading fw-bold mb-1 h6">Финанас-Аналитика</h2>
        <p class="mb-0 small text-dark" v-html="analyticsState.text"></p>
      </div>
    </section>

    <section class="row mb-4 g-3">
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <h3 class="text-muted h6"><i class="bi bi-arrow-up-circle text-success me-1"></i> Доходы за {{ currentMonthName }}</h3>
            <p class="text-success fw-bold m-0 h2">{{ totalIncome.toLocaleString('ru-RU') }} ₽</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <h3 class="text-muted h6"><i class="bi bi-arrow-down-circle text-danger me-1"></i> Расходы за {{ currentMonthName }}</h3>
            <p class="text-danger fw-bold m-0 h2">{{ totalExpense.toLocaleString('ru-RU') }} ₽</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100 bg-dark text-white" style="border-radius: 15px;">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <h3 class="text-white-50 h6"><i class="bi bi-exclamation-circle me-1"></i> Крупнейшая трата</h3>
            <p class="fw-bold mb-1 h4">{{ biggestExpense.title }}</p>
            <div class="d-flex justify-content-center align-items-center">
              <span class="text-danger fw-bold me-2">{{ biggestExpense.amount > 0 ? '-' : '' }} {{ biggestExpense.amount.toLocaleString('ru-RU') }} ₽</span>
              <span class="badge bg-secondary" v-if="biggestExpense.date">{{ formatDate(biggestExpense.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4">
      <section class="col-md-4">
        <div class="card shadow-sm h-100" style="border-radius: 15px;">
          <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <h2 class="card-title mb-4 w-100 text-start h5">Структура расходов</h2>

            <div style="width: 220px; height: 220px; margin: 0 auto;">
              <canvas ref="chartCanvas"></canvas>
            </div>

            <div class="w-100 px-3 mt-3">
              <div v-if="loadingChart" class="text-center text-muted small">Подсчет...</div>
              <div v-else-if="Object.keys(categoriesData).length === 0" class="text-muted small text-center">Нет данных за этот месяц</div>
              <div v-else v-for="(amount, catName, index) in categoriesData" :key="catName" class="d-flex justify-content-between small mb-2 align-items-center">
                <span>
                  <span class="d-inline-block rounded-circle me-2 shadow-sm" :style="{ width: '12px', height: '12px', backgroundColor: ['#fdc003', '#0d6efd', '#0dcaf0', '#dc3545', '#198754', '#6c757d'][index % 6] }"></span>
                  {{ catName }}
                </span>
                <span class="fw-bold">{{ Math.round((amount / totalExpense) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="col-md-8">
        <div class="card shadow-sm h-100" style="border-radius: 15px;">
          <div class="card-body">
            <h2 class="card-title mb-4 h5">Контроль лимитов по категориям</h2>

            <div v-if="loadingLimits" class="text-center text-muted py-3">
              <div class="spinner-border spinner-border-sm text-success" role="status"></div> Подсчет лимитов...
            </div>

            <div v-else>
              <div v-for="(amount, catName) in categoriesData" :key="catName" class="mb-4">
                <template v-if="categoryLimitsData[catName]">
                  <div class="d-flex justify-content-between small mb-1">
                    <span><i class="bi me-1" :class="categoryLimitsData[catName].icon"></i> {{ catName }} (Лимит: {{ categoryLimitsData[catName].limit.toLocaleString('ru-RU') }} ₽)</span>
                    <span class="fw-bold" :class="getLimitColorClass((amount / categoryLimitsData[catName].limit) * 100).split(' ')[1]">
                      {{ amount.toLocaleString('ru-RU') }} ₽ <span class="text-muted fw-normal">/ {{ Math.min((amount / categoryLimitsData[catName].limit) * 100, 100).toFixed(1) }}%</span>
                    </span>
                  </div>
                  <div class="progress" style="height: 15px; border-radius: 10px;">
                    <div class="progress-bar" :class="getLimitColorClass((amount / categoryLimitsData[catName].limit) * 100).split(' ')[0]" :style="{ width: `${Math.min((amount / categoryLimitsData[catName].limit) * 100, 100)}%` }"></div>
                  </div>
                </template>
              </div>
            </div>

            <div class="alert alert-light border small mt-4 mb-0 text-muted">
              <i class="bi bi-info-circle me-1"></i> Цвета полос: основной цвет темы (комфортный остаток), желтый (внимание), красный (близко к исчерпанию).
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
