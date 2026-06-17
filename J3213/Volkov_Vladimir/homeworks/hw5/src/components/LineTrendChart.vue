<template>
  <div class="trend-chart" :class="{ 'is-dense': denseLabels }" role="img" :aria-label="ariaLabel">
    <div class="trend-chart__inner">
      <div class="trend-chart__y-axis" aria-hidden="true">
        <div
          v-for="tick in yAxisTicks"
          :key="tick.key"
          class="trend-chart__y-tick"
          :style="{ top: `${tick.top}%` }"
        >
          <span>{{ tick.label }}</span>
        </div>
      </div>

      <div class="trend-chart__plot">
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" class="trend-chart__svg">
          <defs>
            <linearGradient :id="plotBgId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255, 255, 255, 0.04)" />
              <stop offset="100%" stop-color="rgba(255, 255, 255, 0.015)" />
            </linearGradient>
            <linearGradient :id="expenseGradientId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(147, 197, 253, 0.98)" />
              <stop offset="55%" stop-color="rgba(96, 165, 250, 0.92)" />
              <stop offset="100%" stop-color="rgba(59, 130, 246, 0.74)" />
            </linearGradient>
            <linearGradient :id="incomeGradientId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(110, 231, 183, 0.98)" />
              <stop offset="55%" stop-color="rgba(52, 211, 153, 0.92)" />
              <stop offset="100%" stop-color="rgba(16, 185, 129, 0.72)" />
            </linearGradient>
            <linearGradient :id="expenseSoftId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(147, 197, 253, 0.34)" />
              <stop offset="100%" stop-color="rgba(59, 130, 246, 0.10)" />
            </linearGradient>
            <linearGradient :id="incomeSoftId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(110, 231, 183, 0.34)" />
              <stop offset="100%" stop-color="rgba(16, 185, 129, 0.10)" />
            </linearGradient>
            <filter :id="expenseShadowId" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="1.05" flood-color="rgba(59, 130, 246, 0.18)"/>
            </filter>
            <filter :id="incomeShadowId" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="1.05" flood-color="rgba(16, 185, 129, 0.18)"/>
            </filter>
          </defs>

          <rect x="0" y="8" width="100" height="44" rx="2.6" class="trend-chart__plot-bg" :fill="`url(#${plotBgId})`" />

          <g class="trend-chart__grid">
            <line
              v-for="tick in yAxisTicks"
              :key="`h-${tick.key}`"
              x1="0"
              :y1="tick.svgY"
              x2="100"
              :y2="tick.svgY"
            />
            <line
              v-for="guide in verticalGuides"
              :key="`v-${guide.key}`"
              :x1="guide.x"
              y1="8"
              :x2="guide.x"
              y2="52"
              class="trend-chart__grid-vertical"
              :class="{ 'is-major': guide.isMajor }"
            />
          </g>

          <g class="trend-chart__baseline">
            <line x1="0" y1="52" x2="100" y2="52" />
          </g>

          <g v-for="bar in bars" :key="bar.key" class="trend-chart__bar-group">
            <rect
              :x="bar.hitX"
              y="8"
              :width="bar.hitWidth"
              height="44"
              class="trend-chart__hit-zone"
              @mouseenter="hoveredKey = bar.key"
              @mouseleave="hoveredKey = null"
            />

            <rect
              :x="bar.x"
              :y="bar.y"
              :width="bar.width"
              :height="bar.height"
              rx="1.25"
              ry="1.25"
              class="trend-chart__bar"
              :class="[
                `series-${bar.series}`,
                {
                  'is-peak': bar.isPeak,
                  'is-last': bar.isLast,
                  'is-zero': bar.value === 0,
                  'is-hovered': hoveredKey === bar.key
                }
              ]"
              :fill="bar.value === 0 ? zeroFill(bar.series) : barFill(bar.series)"
              :filter="bar.value > 0 ? barShadow(bar.series) : ''"
            >
              <title>{{ `${bar.fullLabel} · ${bar.seriesLabel}: ${fullMoney(bar.value)}` }}</title>
            </rect>

            <rect
              v-if="bar.value > 0"
              :x="bar.x"
              :y="Math.max(8.2, bar.y + 0.25)"
              :width="bar.width"
              :height="Math.max(0.4, Math.min(4.2, bar.height * 0.34))"
              rx="1.25"
              ry="1.25"
              class="trend-chart__bar-highlight"
              :fill="barSoftFill(bar.series)"
            />
          </g>

          <g v-if="hoveredBar" class="trend-chart__hover-value-group">
            <rect
              :x="hoveredBar.tooltipX"
              :y="hoveredBar.tooltipY"
              :width="hoveredBar.tooltipWidth"
              height="5.1"
              rx="2.15"
              ry="2.15"
              class="trend-chart__hover-value-pill"
              :class="`series-${hoveredBar.series}`"
            />
            <text
              :x="hoveredBar.centerX"
              :y="hoveredBar.tooltipY + 3.35"
              text-anchor="middle"
              class="trend-chart__hover-value-text"
            >
              {{ hoveredBar.tooltipText }}
            </text>
          </g>
        </svg>

        <div class="trend-chart__labels" :style="labelGridStyle">
          <div
            v-for="item in normalizedItems"
            :key="`label-${item.key}`"
            class="trend-chart__label"
            :class="{ 'is-dense-item': denseLabels }"
            :title="item.fullLabel"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  ariaLabel: {
    type: String,
    default: 'График динамики операций'
  },
  denseLabels: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'single'
  },
  singleSeriesType: {
    type: String,
    default: 'expense'
  }
})

const hoveredKey = ref(null)

const chartUid = `chart-${Math.random().toString(36).slice(2, 8)}`
const plotBgId = `${chartUid}-plot-bg`
const expenseGradientId = `${chartUid}-expense-gradient`
const incomeGradientId = `${chartUid}-income-gradient`
const expenseSoftId = `${chartUid}-expense-soft`
const incomeSoftId = `${chartUid}-income-soft`
const expenseShadowId = `${chartUid}-expense-shadow`
const incomeShadowId = `${chartUid}-income-shadow`

const normalizedItems = computed(() =>
  props.items.map((item) => {
    if (Array.isArray(item)) {
      const [key, value] = item
      const numeric = Number(value || 0)
      return {
        key,
        expense: props.singleSeriesType === 'income' ? 0 : numeric,
        income: props.singleSeriesType === 'income' ? numeric : 0,
        ...formatPeriod(key, props.denseLabels)
      }
    }

    const key = item.key ?? item.periodKey ?? item.label ?? ''
    return {
      key,
      expense: Number(item.expense || 0),
      income: Number(item.income || 0),
      ...formatPeriod(key, props.denseLabels)
    }
  })
)

const visibleSeries = computed(() => {
  if (props.mode === 'dual') return ['expense', 'income']
  return [props.singleSeriesType === 'income' ? 'income' : 'expense']
})

const rawMax = computed(() => {
  const values = normalizedItems.value.flatMap((item) => visibleSeries.value.map((series) => Number(item[series] || 0)))
  return Math.max(...values, 1)
})

const niceMax = computed(() => getNiceMax(rawMax.value))

const peakMap = computed(() => {
  const peaks = { expense: -1, income: -1 }
  const maxValues = { expense: -1, income: -1 }

  normalizedItems.value.forEach((item, index) => {
    ;['expense', 'income'].forEach((series) => {
      const value = Number(item[series] || 0)
      if (value >= maxValues[series]) {
        maxValues[series] = value
        peaks[series] = index
      }
    })
  })

  return peaks
})

const yAxisTicks = computed(() => {
  const levels = [1, 0.75, 0.5, 0.25, 0]
  const topStart = 13.33
  const topEnd = 86.67
  const topStep = (topEnd - topStart) / (levels.length - 1)

  return levels.map((level, index) => {
    const value = Math.round(niceMax.value * level)
    const svgY = Number((8 + ((1 - level) * 44)).toFixed(2))
    const top = Number((topStart + topStep * index).toFixed(2))

    return {
      key: `${level}`,
      value,
      svgY,
      top,
      label: compactMoney(value)
    }
  })
})

const bars = computed(() => {
  if (!normalizedItems.value.length) return []

  const count = normalizedItems.value.length
  const slotWidth = 100 / count
  const dense = props.denseLabels
  const dual = props.mode === 'dual'
  const baseY = 52
  const usableHeight = 44

  const singleBarWidth = dense
    ? Math.min(1.65, Math.max(0.95, slotWidth * 0.44))
    : Math.min(6.2, Math.max(1.85, slotWidth * 0.54))

  const dualBarWidth = dense
    ? Math.min(1.1, Math.max(0.52, slotWidth * 0.26))
    : Math.min(3.3, Math.max(0.95, slotWidth * 0.27))

  const dualGap = dense ? Math.max(0.12, slotWidth * 0.04) : Math.max(0.18, slotWidth * 0.05)

  return normalizedItems.value.flatMap((item, index) => {
    const slotStart = slotWidth * index
    const centerX = slotStart + slotWidth / 2
    const definitions = dual
      ? [
          { series: 'expense', offset: -(dualBarWidth / 2 + dualGap / 2) },
          { series: 'income', offset: dualBarWidth / 2 + dualGap / 2 }
        ]
      : [
          { series: visibleSeries.value[0], offset: 0 }
        ]

    return definitions.map((definition) => {
      const value = Number(item[definition.series] || 0)
      const ratio = value / niceMax.value
      const height = value > 0 ? Math.max(0.55, usableHeight * ratio) : 0.42
      const y = baseY - height
      const width = dual ? dualBarWidth : singleBarWidth
      const x = centerX + definition.offset - width / 2
      const tooltipText = `${seriesLabel(definition.series)}: ${compactMoneyNoCurrency(value)}`
      const tooltipWidth = Math.max(9.2, Math.min(19.5, tooltipText.length * 0.75 + 3.4))
      const tooltipY = Math.max(1.8, y - 7)
      const tooltipX = Math.min(100 - tooltipWidth, Math.max(0, centerX - tooltipWidth / 2))

      return {
        key: `${item.key}-${definition.series}`,
        periodKey: item.key,
        value,
        series: definition.series,
        seriesLabel: seriesLabel(definition.series),
        centerX: Number((centerX + definition.offset).toFixed(2)),
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        width: Number(width.toFixed(2)),
        height: Number(height.toFixed(2)),
        hitX: Number((dual ? x - 0.2 : slotStart).toFixed(2)),
        hitWidth: Number((dual ? width + 0.4 : Math.min(slotWidth, 100 - slotStart)).toFixed(2)),
        label: item.label,
        fullLabel: item.fullLabel,
        isPeak: index === peakMap.value[definition.series] && value > 0,
        isLast: index === count - 1,
        tooltipText,
        tooltipWidth: Number(tooltipWidth.toFixed(2)),
        tooltipX: Number(tooltipX.toFixed(2)),
        tooltipY: Number(tooltipY.toFixed(2))
      }
    })
  })
})

const hoveredBar = computed(() => {
  if (!hoveredKey.value) return null
  return bars.value.find((bar) => bar.key === hoveredKey.value) || null
})

const verticalGuides = computed(() => {
  if (!normalizedItems.value.length) return []

  const count = normalizedItems.value.length
  const slotWidth = 100 / count
  const step = props.denseLabels ? Math.max(1, Math.ceil(count / 6)) : 1

  return normalizedItems.value
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => {
      if (!props.denseLabels) return true
      return index === 0 || index === normalizedItems.value.length - 1 || index % step === 0
    })
    .map(({ item, index }) => ({
      key: item.key,
      x: Number((slotWidth * index + slotWidth / 2).toFixed(2)),
      isMajor: props.denseLabels ? (index === 0 || index === normalizedItems.value.length - 1 || index % step === 0) : true
    }))
})

const labelGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(normalizedItems.value.length, 1)}, minmax(0, 1fr))`
}))

function seriesLabel(series) {
  return series === 'income' ? 'Доходы' : 'Расходы'
}

function barFill(series) {
  return series === 'income' ? `url(#${incomeGradientId})` : `url(#${expenseGradientId})`
}

function barSoftFill(series) {
  return series === 'income' ? `url(#${incomeSoftId})` : `url(#${expenseSoftId})`
}

function barShadow(series) {
  return series === 'income' ? `url(#${incomeShadowId})` : `url(#${expenseShadowId})`
}

function zeroFill(series) {
  return series === 'income' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(96, 165, 250, 0.16)'
}

function formatPeriod(periodKey, compact = false) {
  const parts = String(periodKey).split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts
    return {
      label: compact ? `${day}` : `${day}.${month}`,
      fullLabel: `${day}.${month}.${year}`
    }
  }

  if (parts.length === 2) {
    const [year, month] = parts
    const monthIndex = Number(month) - 1
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    return {
      label: `${monthNames[monthIndex] || month}.${year.slice(2)}`,
      fullLabel: `${month}.${year}`
    }
  }

  return {
    label: String(periodKey),
    fullLabel: String(periodKey)
  }
}

function getNiceMax(value) {
  if (!value || value <= 0) return 1

  const exponent = Math.floor(Math.log10(value))
  const magnitude = 10 ** exponent
  const normalized = value / magnitude

  let step
  if (normalized <= 1) step = 1
  else if (normalized <= 2) step = 2
  else if (normalized <= 5) step = 5
  else step = 10

  return step * magnitude
}

function compactMoney(value) {
  const amount = Number(value || 0)

  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    const text = Number.isInteger(millions) ? `${millions}` : millions.toFixed(1).replace('.', ',')
    return `₽ ${text} млн`
  }

  if (amount >= 1_000) {
    const thousands = amount / 1_000
    const text = Number.isInteger(thousands) ? `${thousands}` : thousands.toFixed(1).replace('.', ',')
    return `₽ ${text} тыс.`
  }

  return `₽ ${Math.round(amount)}`
}

function compactMoneyNoCurrency(value) {
  const amount = Number(value || 0)

  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    const text = Number.isInteger(millions) ? `${millions}` : millions.toFixed(1).replace('.', ',')
    return `${text} млн`
  }

  if (amount >= 1_000) {
    const thousands = amount / 1_000
    const text = Number.isInteger(thousands) ? `${thousands}` : thousands.toFixed(1).replace('.', ',')
    return `${text} тыс.`
  }

  return `${Math.round(amount)} ₽`
}

function fullMoney(value) {
  return `₽ ${Number(value || 0).toLocaleString('ru-RU')}`
}
</script>
