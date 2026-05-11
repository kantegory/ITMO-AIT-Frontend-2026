<template>
  <BaseLayout>
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h2 class="section-title mb-2">Страница отчёта</h2>
        <p class="section-subtitle mb-0">
          Сводка по операциям, категориям и прогнозу на основе данных пользователя.
        </p>
      </div>
      <div class="forecast-pill">Прогноз: {{ formatMoney(forecast) }}</div>
    </div>

    <div class="page-card report-filters mb-4">
      <div class="row g-4 align-items-end">
        <div class="col-12">
          <div class="text-secondary small mb-2">Год отчёта</div>
          <div class="segmented-control" role="tablist" aria-label="Фильтр года отчёта">
            <button
              v-for="option in yearOptions"
              :key="option.value"
              type="button"
              class="segmented-btn"
              :class="{ 'is-active': selectedYear === option.value }"
              @click="selectedYear = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="text-secondary small mb-2">Период отчёта</div>
          <div class="segmented-control" role="tablist" aria-label="Фильтр периода отчёта">
            <button
              v-for="option in periodOptions"
              :key="option.value"
              type="button"
              class="segmented-btn"
              :class="{ 'is-active': selectedPeriod === option.value }"
              @click="selectedPeriod = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="text-secondary small mb-2">Тип операций</div>
          <div class="segmented-control" role="tablist" aria-label="Фильтр по типу операций">
            <button
              v-for="option in typeOptions"
              :key="option.value"
              type="button"
              class="segmented-btn"
              :class="{ 'is-active': selectedType === option.value }"
              @click="selectedType = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div :class="chartColumnClass">
        <div class="page-card h-100">
          <div class="report-chart-header mb-3">
            <h3 class="h5 fw-bold mb-0">{{ chartTitle }}</h3>
            <div class="report-chart-period-nav" aria-live="polite">
              <button
                type="button"
                class="chart-arrow-btn"
                :disabled="!canGoPrev"
                aria-label="Показать предыдущий период"
                @click="shiftAnchor(-1)"
              >
                <span aria-hidden="true">‹</span>
              </button>

              <div class="report-chart-period-label">{{ visibleRangeLabel }}</div>

              <button
                type="button"
                class="chart-arrow-btn"
                :disabled="!canGoNext"
                aria-label="Показать следующий период"
                @click="shiftAnchor(1)"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>

          <div v-if="hasChartData" class="d-flex flex-column gap-4">
            <div v-if="selectedType === 'all'" class="report-chart-legend">
              <span class="report-chart-legend__item">
                <span class="report-chart-legend__dot is-income"></span>
                Доходы
              </span>
              <span class="report-chart-legend__item">
                <span class="report-chart-legend__dot is-expense"></span>
                Расходы
              </span>
            </div>

            <LineTrendChart
              :items="chartItems"
              :aria-label="chartTitle"
              :dense-labels="useDailySeries"
              :mode="selectedType === 'all' ? 'dual' : 'single'"
              :single-series-type="selectedType === 'income' ? 'income' : 'expense'"
            />

            <div class="daily-detail-card">
              <div class="daily-detail-card__header">
                <div>
                  <div class="text-secondary small mb-2">{{ detailCardCaption }}</div>
                  <div class="daily-detail-card__title">{{ detailCardTitle }}</div>
                </div>

                <div class="detail-controls">
                  <div class="segmented-control detail-filter-control" role="tablist" aria-label="Фильтр детализации по типу операций">
                    <button
                      v-for="option in detailTypeOptions"
                      :key="option.value"
                      type="button"
                      class="segmented-btn segmented-btn--compact"
                      :class="{ 'is-active': selectedDetailType === option.value }"
                      @click="selectedDetailType = option.value"
                    >
                      {{ option.label }}
                    </button>
                  </div>

                  <select v-model="selectedDayKey" class="form-select daily-detail-card__select" :aria-label="detailSelectAriaLabel">
                    <option v-for="option in dayOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="report-row mb-0">
                <div class="d-flex justify-content-between align-items-center mb-2 gap-3">
                  <span class="fw-semibold">{{ selectedDayLabel }}</span>
                  <span class="text-secondary">{{ formatMoney(selectedDetailValue) }}</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" :class="detailProgressClass" :style="{ width: `${seriesBarWidth(selectedDetailValue)}%` }"></div>
                </div>
              </div>

              <div class="detail-breakdown mt-3" v-if="selectedPeriodTransactions.length">
                <div class="detail-breakdown__header">
                  <div>
                    <div class="text-secondary small mb-2">Подробный разбор</div>
                    <div class="daily-detail-card__title">Категории и операции за {{ selectedDayLabel }}</div>
                  </div>
                  <div class="detail-breakdown__count">{{ detailCountLabel }}</div>
                </div>

                <div class="detail-breakdown__groups">
                  <section
                    v-if="detailExpenseCategories.length"
                    class="detail-type-card is-expense"
                  >
                    <div class="detail-type-card__header">
                      <span class="detail-type-card__title">Расходы по категориям</span>
                      <span class="detail-type-card__sum">{{ formatMoney(detailExpenseTotal) }}</span>
                    </div>

                    <div class="detail-category-list">
                      <div v-for="item in detailExpenseCategories" :key="`expense-${item.category}`" class="detail-category-row">
                        <div>
                          <div class="detail-category-row__title">{{ item.category }}</div>
                          <div class="detail-category-row__meta">{{ item.count }} {{ pluralizeOperations(item.count) }}</div>
                        </div>
                        <div class="detail-category-row__amount">{{ formatMoney(item.total) }}</div>
                      </div>
                    </div>
                  </section>

                  <section
                    v-if="detailIncomeCategories.length"
                    class="detail-type-card is-income"
                  >
                    <div class="detail-type-card__header">
                      <span class="detail-type-card__title">Доходы по категориям</span>
                      <span class="detail-type-card__sum">{{ formatMoney(detailIncomeTotal) }}</span>
                    </div>

                    <div class="detail-category-list">
                      <div v-for="item in detailIncomeCategories" :key="`income-${item.category}`" class="detail-category-row">
                        <div>
                          <div class="detail-category-row__title">{{ item.category }}</div>
                          <div class="detail-category-row__meta">{{ item.count }} {{ pluralizeOperations(item.count) }}</div>
                        </div>
                        <div class="detail-category-row__amount">{{ formatMoney(item.total) }}</div>
                      </div>
                    </div>
                  </section>
                </div>

                <div class="detail-transactions-card mt-3">
                  <div class="detail-transactions-card__header">
                    <span class="detail-transactions-card__title">{{ detailTransactionsTitle }}</span>
                    <span class="detail-transactions-card__subtitle">Дата, категория и сумма</span>
                  </div>

                  <div class="detail-transactions-list">
                    <article
                      v-for="item in selectedPeriodTransactions"
                      :key="`detail-${item.id}`"
                      class="detail-transaction-row"
                    >
                      <div class="detail-transaction-row__date">{{ formatFullDate(item.date) }}</div>
                      <div class="detail-transaction-row__content">
                        <div class="detail-transaction-row__topline">
                          <span class="detail-transaction-row__category">{{ item.category }}</span>
                          <span class="detail-transaction-row__type" :class="typeBadgeClass(item.type)">
                            {{ typeBadgeLabel(item.type) }}
                          </span>
                        </div>
                        <div class="detail-transaction-row__description">{{ item.description || 'Без описания' }}</div>
                      </div>
                      <div class="detail-transaction-row__amount" :class="typeAmountClass(item.type)">
                        {{ item.type === 'income' ? '+' : '-' }} {{ formatMoney(normalizeAmount(item.amount)) }}
                      </div>
                    </article>
                  </div>
                </div>
              </div>

              <div v-else class="empty-state mt-3">{{ detailEmptyState }}</div>
            </div>
          </div>

          <div v-else class="empty-state">{{ chartEmptyState }}</div>
        </div>
      </div>

      <div :class="categoriesColumnClass">
        <div class="page-card h-100">
          <div class="d-flex justify-content-between align-items-start mb-3 gap-3 flex-wrap">
            <div>
              <h3 class="h5 fw-bold mb-2">{{ categoriesTitle }}</h3>
              <span class="text-secondary small">{{ visibleRangeLabel }}</span>
            </div>

            <div class="segmented-control detail-filter-control" role="tablist" aria-label="Фильтр категорий за период">
              <button
                v-for="option in categoryTypeOptions"
                :key="option.value"
                type="button"
                class="segmented-btn segmented-btn--compact"
                :class="{ 'is-active': selectedCategoryType === option.value }"
                @click="selectedCategoryType = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div v-if="categoryEntries.length" class="d-flex flex-column gap-3">
            <div v-for="[category, value] in categoryEntries" :key="category" class="report-row">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span>{{ category }}</span>
                <span class="text-secondary">{{ formatMoney(value) }}</span>
              </div>
              <div class="progress">
                <div class="progress-bar" :class="categoryProgressClass" :style="{ width: `${categoryBarWidth(value)}%` }"></div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">{{ categoriesEmptyState }}</div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-xl-3">
        <div class="metric-card h-100">
          <div class="metric-label">{{ averageMetricLabel }}</div>
          <div class="metric-value">{{ formatMoney(avgAmount) }}</div>
        </div>
      </div>
      <div class="col-md-6 col-xl-3">
        <div class="metric-card h-100">
          <div class="metric-label">{{ maxMetricLabel }}</div>
          <div class="metric-value">{{ formatMoney(maxAmount) }}</div>
        </div>
      </div>
      <div class="col-md-6 col-xl-3">
        <div class="metric-card h-100">
          <div class="metric-label">Всего операций</div>
          <div class="metric-value">{{ operationsCount }}</div>
        </div>
      </div>
      <div class="col-md-6 col-xl-3">
        <div class="metric-card h-100">
          <div class="metric-label">Категорий за период</div>
          <div class="metric-value">{{ metricCategoryCount }}</div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import LineTrendChart from '@/components/finance/LineTrendChart.vue'
import { useFinanceStore } from '@/stores/finance'
import { useUserFinanceData } from '@/composables/useUserFinanceData'
import { formatMoney } from '@/utils'

const financeStore = useFinanceStore()

const MONTH_LABELS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

const periodOptions = [
  { value: 1, label: '1 месяц' },
  { value: 3, label: '3 месяца' },
  { value: 6, label: '6 месяцев' },
  { value: 12, label: '1 год' }
]

const typeOptions = [
  { value: 'expense', label: 'Расходы' },
  { value: 'income', label: 'Доходы' },
  { value: 'all', label: 'Все' }
]

const detailTypeOptions = [
  { value: 'all', label: 'Все' },
  { value: 'expense', label: 'Расходы' },
  { value: 'income', label: 'Доходы' }
]

const categoryTypeOptions = [
  { value: 'expense', label: 'Расходы' },
  { value: 'income', label: 'Доходы' },
  { value: 'all', label: 'Все' }
]

const selectedPeriod = ref(6)
const selectedType = ref('expense')
const selectedDetailType = ref('all')
const selectedCategoryType = ref('expense')
const selectedYear = ref('all')
const anchorOffsetMonths = ref(0)

const today = computed(() => startOfDay(new Date()))
const currentMonthStart = computed(() => startOfMonth(today.value))
const currentMonthEnd = computed(() => endOfMonth(today.value))
const currentYear = computed(() => today.value.getFullYear())

const availableYears = computed(() => {
  const years = new Set([currentYear.value, currentYear.value - 1])

  financeStore.transactions.forEach((item) => {
    const itemDate = parseDate(item.date)
    if (itemDate && isReasonableYear(itemDate.getFullYear())) {
      years.add(itemDate.getFullYear())
    }
  })

  return [...years].sort((a, b) => b - a)
})

const yearOptions = computed(() => [
  { value: 'all', label: 'Все годы' },
  ...availableYears.value.map((year) => ({ value: year, label: String(year) }))
])

watch(availableYears, (years) => {
  if (!years.length) {
    selectedYear.value = 'all'
    return
  }

  if (selectedYear.value === 'all') return
  if (!years.includes(selectedYear.value)) {
    selectedYear.value = years[0]
  }
}, { immediate: true })


const yearTransactions = computed(() =>
  financeStore.transactions.filter((item) => {
    const itemDate = parseDate(item.date)
    if (!itemDate || !isReasonableYear(itemDate.getFullYear())) return false

    if (selectedYear.value === 'all') {
      return itemDate <= currentMonthEnd.value
    }

    if (itemDate.getFullYear() !== Number(selectedYear.value)) return false

    if (Number(selectedYear.value) === currentYear.value) {
      return itemDate <= currentMonthEnd.value
    }

    return true
  })
)

const latestPastYearDate = computed(() => {
  const validDates = yearTransactions.value
    .map((item) => parseDate(item.date))
    .filter(Boolean)

  if (!validDates.length || selectedYear.value === 'all') return null

  return validDates.reduce((maxDate, current) => (current > maxDate ? current : maxDate))
})

const latestAnchorMonth = computed(() => {
  if (selectedYear.value === 'all' || Number(selectedYear.value) === currentYear.value) {
    return currentMonthStart.value
  }

  if (latestPastYearDate.value) {
    return startOfMonth(latestPastYearDate.value)
  }

  return startOfMonth(new Date(Number(selectedYear.value), 11, 1))
})

const earliestAnchorMonth = computed(() => {
  if (selectedYear.value === 'all') {
    const validDates = financeStore.transactions
      .map((item) => parseDate(item.date))
      .filter((date) => date && isReasonableYear(date.getFullYear()))

    if (!validDates.length) {
      return startOfMonth(new Date(currentYear.value - 1, 0, 1))
    }

    const earliest = validDates.reduce((minDate, current) => (current < minDate ? current : minDate))
    return startOfMonth(earliest)
  }

  return startOfMonth(new Date(Number(selectedYear.value), 0, 1))
})

const anchorMonthStart = computed(() => {
  const shifted = addMonths(latestAnchorMonth.value, anchorOffsetMonths.value)
  return clampMonth(shifted, earliestAnchorMonth.value, latestAnchorMonth.value)
})

const canGoPrev = computed(() => monthDiff(anchorMonthStart.value, earliestAnchorMonth.value) > 0)
const canGoNext = computed(() => monthDiff(latestAnchorMonth.value, anchorMonthStart.value) > 0)

watch([selectedYear, selectedPeriod], () => {
  anchorOffsetMonths.value = 0
})

const reportRange = computed(() => {
  const selectedYearNumber = selectedYear.value === 'all' ? null : Number(selectedYear.value)
  const isCurrentTimeline = selectedYear.value === 'all' || selectedYearNumber === currentYear.value
  const isCurrentAnchorMonth = sameMonth(anchorMonthStart.value, currentMonthStart.value) && isCurrentTimeline

  const endDate = isCurrentAnchorMonth ? endOfDay(today.value) : endOfMonth(anchorMonthStart.value)

  let startDate
  if (selectedPeriod.value === 1) {
    startDate = startOfMonth(anchorMonthStart.value)
  } else {
    startDate = startOfMonth(addMonths(anchorMonthStart.value, -(selectedPeriod.value - 1)))
  }

  if (selectedYearNumber !== null) {
    const yearStart = startOfDay(new Date(selectedYearNumber, 0, 1))
    if (startDate < yearStart) {
      startDate = yearStart
    }
  }

  return {
    startDate: startOfDay(startDate),
    endDate
  }
})

const transactionsForPeriod = computed(() =>
  yearTransactions.value.filter((item) => {
    const itemDate = parseDate(item.date)
    return itemDate && itemDate >= reportRange.value.startDate && itemDate <= reportRange.value.endDate
  })
)

const filteredTransactions = computed(() => {
  if (selectedType.value === 'all') return transactionsForPeriod.value
  return transactionsForPeriod.value.filter((item) => item.type === selectedType.value)
})

const useDailySeries = computed(() => selectedPeriod.value === 1)

const periodKeys = computed(() => buildPeriodKeys(reportRange.value.startDate, reportRange.value.endDate, useDailySeries.value))

const chartItems = computed(() => {
  const totals = new Map(periodKeys.value.map((key) => [key, { expense: 0, income: 0 }]))

  transactionsForPeriod.value.forEach((item) => {
    const periodKey = useDailySeries.value ? item.date : item.date.slice(0, 7)
    if (!totals.has(periodKey)) return

    const bucket = totals.get(periodKey)
    if (item.type === 'income') {
      bucket.income += normalizeAmount(item.amount)
    } else {
      bucket.expense += normalizeAmount(item.amount)
    }
  })

  return [...totals.entries()].map(([key, value]) => ({ key, ...value }))
})

const chartSeries = computed(() => {
  const totals = new Map(periodKeys.value.map((key) => [key, 0]))

  filteredTransactions.value.forEach((item) => {
    const periodKey = useDailySeries.value ? item.date : item.date.slice(0, 7)
    if (!totals.has(periodKey)) return
    totals.set(periodKey, (totals.get(periodKey) || 0) + normalizeAmount(item.amount))
  })

  return [...totals.entries()]
})

const hasChartData = computed(() => {
  if (selectedType.value === 'income') {
    return chartItems.value.some((item) => item.income > 0)
  }

  if (selectedType.value === 'all') {
    return chartItems.value.some((item) => item.expense > 0 || item.income > 0)
  }

  return chartItems.value.some((item) => item.expense > 0)
})

const chartColumnClass = computed(() => 'col-12')
const categoriesColumnClass = computed(() => 'col-12')

const detailPeriodSeries = computed(() => {
  const totals = new Map(periodKeys.value.map((key) => [key, 0]))

  transactionsForPeriod.value.forEach((item) => {
    const periodKey = useDailySeries.value ? item.date : item.date.slice(0, 7)
    if (!totals.has(periodKey)) return
    totals.set(periodKey, (totals.get(periodKey) || 0) + normalizeAmount(item.amount))
  })

  return [...totals.entries()]
})

const selectedDayKey = ref('')

const dayOptions = computed(() =>
  detailPeriodSeries.value.map(([periodKey]) => ({
    value: periodKey,
    label: formatSeriesOptionLabel(periodKey)
  }))
)

watch(detailPeriodSeries, (series) => {
  if (!series.length) {
    selectedDayKey.value = ''
    return
  }

  const hasCurrent = series.some(([periodKey]) => periodKey === selectedDayKey.value)
  if (hasCurrent) return

  const preferred = [...series].reverse().find(([, value]) => value > 0)?.[0] ?? series[series.length - 1][0]
  selectedDayKey.value = preferred
}, { immediate: true })

const selectedDayEntry = computed(() =>
  detailPeriodSeries.value.find(([periodKey]) => periodKey === selectedDayKey.value) ?? detailPeriodSeries.value[detailPeriodSeries.value.length - 1] ?? ['', 0]
)

const selectedDayLabel = computed(() => formatSeriesOptionLabel(selectedDayEntry.value[0]))
const selectedDayValue = computed(() => Number(selectedDayEntry.value[1] || 0))
const selectedPeriodTransactions = computed(() => {
  if (!selectedDayKey.value) return []

  const matched = transactionsForPeriod.value.filter((item) => {
    const periodKey = useDailySeries.value ? item.date : item.date.slice(0, 7)
    if (periodKey !== selectedDayKey.value) return false
    if (selectedDetailType.value === 'all') return true
    return item.type === selectedDetailType.value
  })

  return [...matched].sort((a, b) => b.date.localeCompare(a.date))
})

const selectedDetailValue = computed(() =>
  selectedPeriodTransactions.value.reduce((sum, item) => sum + normalizeAmount(item.amount), 0)
)

const detailExpenseCategories = computed(() => buildDetailCategorySummary(selectedPeriodTransactions.value, 'expense'))
const detailIncomeCategories = computed(() => buildDetailCategorySummary(selectedPeriodTransactions.value, 'income'))
const detailExpenseTotal = computed(() => detailExpenseCategories.value.reduce((sum, item) => sum + item.total, 0))
const detailIncomeTotal = computed(() => detailIncomeCategories.value.reduce((sum, item) => sum + item.total, 0))

const detailCountLabel = computed(() => {
  const count = selectedPeriodTransactions.value.length
  if (selectedDetailType.value === 'income') return `Доходов: ${count}`
  if (selectedDetailType.value === 'expense') return `Расходов: ${count}`
  return `Операций: ${count}`
})

const detailTransactionsTitle = computed(() => {
  if (selectedDetailType.value === 'income') return 'Доходы за выбранный период'
  if (selectedDetailType.value === 'expense') return 'Расходы за выбранный период'
  return 'Операции за выбранный период'
})

const detailEmptyState = computed(() => {
  if (selectedDetailType.value === 'income') return 'За выбранный период доходов пока нет.'
  if (selectedDetailType.value === 'expense') return 'За выбранный период расходов пока нет.'
  return 'За выбранный период операций пока нет.'
})

const detailCardCaption = computed(() => useDailySeries.value ? 'Детализация по дню' : 'Детализация по периоду')
const detailCardTitle = computed(() => useDailySeries.value ? 'Выберите день месяца' : 'Выберите месяц из периода')
const detailSelectAriaLabel = computed(() => useDailySeries.value ? 'Выбор дня отчёта' : 'Выбор месяца отчёта')
const detailProgressClass = computed(() => {
  if (selectedDetailType.value === 'income') return 'report-progress-income'
  if (selectedDetailType.value === 'all') return 'report-progress-total'
  return 'report-progress-expense'
})

const chartCategoryEntries = computed(() => {
  const totals = {}

  filteredTransactions.value.forEach((item) => {
    totals[item.category] = (totals[item.category] || 0) + normalizeAmount(item.amount)
  })

  return Object.entries(totals).sort((a, b) => b[1] - a[1])
})

const categoryEntries = computed(() => {
  const totals = {}

  transactionsForPeriod.value
    .filter((item) => selectedCategoryType.value === 'all' ? true : item.type === selectedCategoryType.value)
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + normalizeAmount(item.amount)
    })

  return Object.entries(totals).sort((a, b) => b[1] - a[1])
})

const metricCategoryCount = computed(() => chartCategoryEntries.value.length)

const forecast = computed(() => {
  const nonZeroPeriods = chartSeries.value.filter(([, value]) => value > 0)
  if (!nonZeroPeriods.length) return 0

  const lastThree = nonZeroPeriods.slice(-3)
  const total = lastThree.reduce((sum, [, value]) => sum + value, 0)
  return Math.round(total / lastThree.length)
})

const avgAmount = computed(() => {
  if (!filteredTransactions.value.length) return 0

  const total = filteredTransactions.value.reduce((sum, item) => sum + normalizeAmount(item.amount), 0)
  return Math.round(total / filteredTransactions.value.length)
})

const maxAmount = computed(() => {
  if (!filteredTransactions.value.length) return 0
  return Math.max(...filteredTransactions.value.map((item) => normalizeAmount(item.amount)))
})

const operationsCount = computed(() => filteredTransactions.value.length)

const chartTitle = computed(() => {
  if (selectedType.value === 'income') return 'Динамика доходов'
  if (selectedType.value === 'all') return 'Динамика доходов и расходов'
  return 'Динамика расходов'
})

const categoriesTitle = computed(() => {
  if (selectedCategoryType.value === 'income') return 'Категории доходов за период'
  if (selectedCategoryType.value === 'all') return 'Категории операций за период'
  return 'Категории расходов за период'
})

const averageMetricLabel = computed(() => {
  if (selectedType.value === 'income') return 'Средний доход'
  if (selectedType.value === 'all') return 'Средняя сумма'
  return 'Средний чек'
})

const maxMetricLabel = computed(() => {
  if (selectedType.value === 'income') return 'Максимальный доход'
  if (selectedType.value === 'all') return 'Максимальная сумма'
  return 'Максимальный расход'
})

const chartEmptyState = computed(() => {
  if (selectedType.value === 'income') return 'За выбранный период доходов пока нет.'
  if (selectedType.value === 'all') return 'За выбранный период операций пока нет.'
  return 'За выбранный период расходов пока нет.'
})

const categoriesEmptyState = computed(() => {
  if (selectedCategoryType.value === 'income') return 'За выбранный период доходов по категориям пока нет.'
  if (selectedCategoryType.value === 'all') return 'За выбранный период операций по категориям пока нет.'
  return 'За выбранный период расходов по категориям пока нет.'
})

const categoryProgressClass = computed(() => {
  if (selectedCategoryType.value === 'income') return 'report-progress-income'
  if (selectedCategoryType.value === 'all') return 'report-progress-total'
  return 'report-progress-expense'
})

const visibleRangeLabel = computed(() => {
  if (selectedPeriod.value === 1) {
    return capitalizeMonthName(anchorMonthStart.value)
  }

  const startMonth = startOfMonth(reportRange.value.startDate)
  const endMonth = startOfMonth(reportRange.value.endDate)

  if (sameMonth(startMonth, endMonth)) {
    return capitalizeMonthName(endMonth)
  }

  return `${capitalizeMonthName(startMonth)} — ${capitalizeMonthName(endMonth)}`
})

function shiftAnchor(delta) {
  if (delta < 0 && !canGoPrev.value) return
  if (delta > 0 && !canGoNext.value) return

  const proposed = addMonths(anchorMonthStart.value, delta)
  const clamped = clampMonth(proposed, earliestAnchorMonth.value, latestAnchorMonth.value)
  anchorOffsetMonths.value = monthDiff(clamped, latestAnchorMonth.value)
}

function normalizeAmount(value) {
  return Math.abs(Number(value || 0))
}

function startOfDay(date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

function endOfDay(date) {
  const normalized = new Date(date)
  normalized.setHours(23, 59, 59, 999)
  return normalized
}

function startOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

function endOfMonth(date) {
  const normalized = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  normalized.setHours(23, 59, 59, 999)
  return normalized
}

function addMonths(date, amount) {
  return startOfMonth(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

function sameMonth(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth()
}

function clampMonth(date, minDate, maxDate) {
  if (date < minDate) return minDate
  if (date > maxDate) return maxDate
  return date
}

function monthDiff(laterDate, earlierDate) {
  return (laterDate.getFullYear() - earlierDate.getFullYear()) * 12 + (laterDate.getMonth() - earlierDate.getMonth())
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : startOfDay(date)
}

function isReasonableYear(year) {
  return year >= 2020 && year <= 2100
}

function buildPeriodKeys(startDate, endDate, useDaily = false) {
  const keys = []

  if (useDaily) {
    const cursor = new Date(startDate)
    const last = new Date(endDate)

    while (cursor <= last) {
      keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`)
      cursor.setDate(cursor.getDate() + 1)
    }

    return keys
  }

  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (cursor <= last) {
    keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`)
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return keys
}

function formatPeriodLabel(periodKey) {
  const parts = periodKey.split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}.${month}.${year.slice(2)}`
  }

  const [year, month] = parts
  return `${month}.${year.slice(2)}`
}

function formatDayOptionLabel(periodKey) {
  if (!periodKey) return 'Нет данных'
  const parts = String(periodKey).split('-')
  if (parts.length !== 3) return formatPeriodLabel(periodKey)

  const [year, month, day] = parts
  const monthIndex = Number(month) - 1
  const monthName = MONTH_LABELS[monthIndex] || month
  return `${Number(day)} ${monthName} ${year}`
}

function formatSeriesOptionLabel(periodKey) {
  if (!periodKey) return 'Нет данных'
  return useDailySeries.value ? formatDayOptionLabel(periodKey) : formatMonthOptionLabel(periodKey)
}

function formatMonthOptionLabel(periodKey) {
  if (!periodKey) return 'Нет данных'
  const parts = String(periodKey).split('-')
  if (parts.length !== 2) return formatPeriodLabel(periodKey)

  const [year, month] = parts
  const monthIndex = Number(month) - 1
  const monthName = MONTH_LABELS[monthIndex] || month
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`
}

function capitalizeMonthName(date) {
  const monthName = MONTH_LABELS[date.getMonth()] || ''
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${date.getFullYear()}`
}

function seriesBarWidth(value) {
  const maxValue = Math.max(...chartSeries.value.map(([, amount]) => amount), 1)
  return Math.round((value / maxValue) * 100)
}

function categoryBarWidth(value) {
  const maxValue = Math.max(...categoryEntries.value.map(([, amount]) => amount), 1)
  return Math.round((value / maxValue) * 100)
}

function buildDetailCategorySummary(transactions, type) {
  const totals = {}

  transactions
    .filter((item) => item.type === type)
    .forEach((item) => {
      const category = item.category || 'Без категории'

      if (!totals[category]) {
        totals[category] = { category, total: 0, count: 0 }
      }

      totals[category].total += normalizeAmount(item.amount)
      totals[category].count += 1
    })

  return Object.values(totals).sort((a, b) => b.total - a.total)
}

function typeBadgeLabel(type) {
  return type === 'income' ? 'Доход' : 'Расход'
}

function typeBadgeClass(type) {
  return type === 'income' ? 'is-income' : 'is-expense'
}

function typeAmountClass(type) {
  return type === 'income' ? 'is-income' : 'is-expense'
}

function formatFullDate(value) {
  if (!value) return 'Нет даты'
  const parts = String(value).split('-')

  if (parts.length !== 3) return value

  const [year, month, day] = parts
  return `${day}.${month}.${year}`
}

function pluralizeOperations(count) {
  const value = Math.abs(Number(count || 0))
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) return 'операция'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'операции'
  return 'операций'
}

useUserFinanceData()

watch(
  availableYears,
  (years) => {
    if (!years.length) return

    if (years.includes(currentYear.value)) {
      selectedYear.value = currentYear.value
      return
    }

    selectedYear.value = years[0]
  },
  { immediate: true }
)
</script>
