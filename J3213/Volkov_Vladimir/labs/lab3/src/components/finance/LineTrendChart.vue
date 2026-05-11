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
        <svg viewBox="0 0 100 64" preserveAspectRatio="none" class="trend-chart__svg">
          <defs>
            <linearGradient :id="plotBgId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255, 255, 255, 0.055)" />
              <stop offset="100%" stop-color="rgba(255, 255, 255, 0.015)" />
            </linearGradient>

            <linearGradient :id="incomeFillId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(147, 197, 253, 0.98)" />
              <stop offset="100%" stop-color="rgba(59, 130, 246, 0.84)" />
            </linearGradient>

            <linearGradient :id="expenseFillId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(251, 146, 153, 0.98)" />
              <stop offset="100%" stop-color="rgba(244, 63, 94, 0.84)" />
            </linearGradient>

            <filter :id="incomeGlowId" x="-60%" y="-60%" width="220%" height="240%">
              <feDropShadow dx="0" dy="0.55" stdDeviation="0.9" flood-color="rgba(59, 130, 246, 0.28)" />
            </filter>

            <filter :id="expenseGlowId" x="-60%" y="-60%" width="220%" height="240%">
              <feDropShadow dx="0" dy="0.55" stdDeviation="0.9" flood-color="rgba(244, 63, 94, 0.24)" />
            </filter>
          </defs>

          <rect
            x="0"
            :y="PLOT_TOP"
            width="100"
            :height="PLOT_HEIGHT"
            rx="3.2"
            class="trend-chart__plot-bg"
            :fill="`url(#${plotBgId})`"
          />

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
              :y1="PLOT_TOP"
              :x2="guide.x"
              :y2="BASELINE_Y"
              class="trend-chart__grid-vertical"
              :class="{ 'is-major': guide.isMajor, 'is-hovered': hoveredIndex === guide.index }"
            />
          </g>

          <g v-if="hoveredGroup" class="trend-chart__focus-layer">
            <rect
              class="trend-chart__focus-band"
              :x="hoveredGroup.focusX"
              :y="PLOT_TOP"
              :width="hoveredGroup.focusWidth"
              :height="PLOT_HEIGHT"
              rx="1.3"
            />
          </g>

          <g class="trend-chart__bars-layer">
            <template v-for="group in groups" :key="group.key">
              <template v-for="bar in group.bars" :key="bar.key">
                <rect
                  class="trend-chart__bar-shadow"
                  :class="`series-${bar.series}`"
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.width"
                  :height="bar.height"
                  :rx="bar.rx"
                  :filter="bar.filter"
                />

                <rect
                  class="trend-chart__bar"
                  :class="[
                    `series-${bar.series}`,
                    {
                      'is-hovered': hoveredIndex === group.index,
                      'is-empty': bar.value === 0
                    }
                  ]"
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.width"
                  :height="bar.height"
                  :rx="bar.rx"
                  :fill="bar.fill"
                >
                  <title>{{ `${group.fullLabel} · ${seriesLabel(bar.series)}: ${fullMoney(bar.value)}` }}</title>
                </rect>
              </template>
            </template>
          </g>


          <g v-for="group in groups" :key="`hit-${group.key}`" class="trend-chart__hit-group">
            <rect
              :x="group.hitX"
              :y="PLOT_TOP"
              :width="group.hitWidth"
              :height="PLOT_HEIGHT"
              class="trend-chart__hit-zone"
              @mouseenter="hoveredIndex = group.index"
              @mouseleave="hoveredIndex = null"
            />
          </g>
        </svg>

        <div
          v-if="tooltip"
          class="trend-chart__tooltip-html"
          :class="[`is-${tooltip.placement}`]"
          :style="tooltipStyle"
        >
          <div class="trend-chart__tooltip-html-title">{{ tooltip.title }}</div>
          <div
            v-for="line in tooltip.lines"
            :key="line.key"
            class="trend-chart__tooltip-html-line"
          >
            <span class="trend-chart__tooltip-html-dot" :class="`series-${line.series}`"></span>
            <span>{{ line.text }}</span>
          </div>
        </div>

        <div class="trend-chart__labels" :style="labelGridStyle">
          <div
            v-for="item in normalizedItems"
            :key="`label-${item.key}`"
            class="trend-chart__label"
            :class="{ 'is-dense-item': denseLabels, 'is-active': hoveredIndex === item.index }"
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

const PLOT_TOP = 8
const PLOT_HEIGHT = 44
const BASELINE_Y = PLOT_TOP + PLOT_HEIGHT
const PLOT_LEFT = 2.8
const PLOT_RIGHT = 97.2
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT

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

const hoveredIndex = ref(null)

const chartUid = `chart-${Math.random().toString(36).slice(2, 8)}`
const plotBgId = `${chartUid}-plot-bg`
const incomeFillId = `${chartUid}-income-fill`
const expenseFillId = `${chartUid}-expense-fill`
const incomeGlowId = `${chartUid}-income-glow`
const expenseGlowId = `${chartUid}-expense-glow`

const normalizedItems = computed(() =>
  props.items.map((item, index) => {
    if (Array.isArray(item)) {
      const [key, value] = item
      const numeric = Number(value || 0)
      return {
        key,
        index,
        expense: props.singleSeriesType === 'income' ? 0 : numeric,
        income: props.singleSeriesType === 'income' ? numeric : 0,
        ...formatPeriod(key, props.denseLabels)
      }
    }

    const key = item.key ?? item.periodKey ?? item.label ?? ''
    return {
      key,
      index,
      expense: Number(item.expense || 0),
      income: Number(item.income || 0),
      ...formatPeriod(key, props.denseLabels)
    }
  })
)

const visibleSeries = computed(() => {
  if (props.mode === 'dual') return ['income', 'expense']
  return [props.singleSeriesType === 'income' ? 'income' : 'expense']
})

const maxValue = computed(() => {
  const largest = normalizedItems.value.reduce((max, item) => {
    const currentValues = visibleSeries.value.map((series) => Number(item[series] || 0))
    return Math.max(max, ...currentValues)
  }, 0)

  if (largest <= 0) return 1000
  return roundUpNice(largest)
})

const yAxisTicks = computed(() => {
  const ticksCount = 4
  const ticks = []

  for (let index = 0; index <= ticksCount; index += 1) {
    const ratio = index / ticksCount
    const value = Math.round(maxValue.value * (1 - ratio))
    const svgY = PLOT_TOP + PLOT_HEIGHT * ratio
    const top = (svgY / 64) * 100

    ticks.push({
      key: index,
      value,
      label: shortMoney(value),
      svgY,
      top
    })
  }

  return ticks
})

const groups = computed(() => {
  const items = normalizedItems.value
  const count = items.length || 1
  const step = PLOT_WIDTH / count
  const groupWidth = Math.min(step * (props.mode === 'dual' ? 0.64 : 0.52), props.denseLabels ? 2.1 : 5.4)
  const innerGap = props.mode === 'dual' ? Math.max(0.16, Math.min(groupWidth * 0.12, 0.48)) : 0
  const barWidth = props.mode === 'dual' ? Math.max(0.34, (groupWidth - innerGap) / 2) : Math.max(0.52, groupWidth)
  const bandWidth = Math.min(step * 0.92, props.denseLabels ? 2.8 : 7.2)

  return items.map((item, index) => {
    const centerX = PLOT_LEFT + step * index + step / 2
    const hitWidth = index === count - 1 ? PLOT_RIGHT - (centerX - bandWidth / 2) : bandWidth
    const startX = centerX - groupWidth / 2

    const bars = visibleSeries.value.map((series, seriesIndex) => {
      const value = Number(item[series] || 0)
      const height = barHeight(value)
      const x = props.mode === 'dual'
        ? startX + seriesIndex * (barWidth + innerGap)
        : centerX - barWidth / 2
      const y = BASELINE_Y - height

      return {
        key: `${item.key}-${series}`,
        series,
        value,
        x,
        y,
        width: barWidth,
        height,
        rx: Math.min(1.05, barWidth / 2),
        fill: `url(#${series === 'income' ? incomeFillId : expenseFillId})`,
        filter: `url(#${series === 'income' ? incomeGlowId : expenseGlowId})`
      }
    })

    return {
      ...item,
      centerX,
      hitX: centerX - bandWidth / 2,
      hitWidth,
      focusX: centerX - bandWidth * 0.42,
      focusWidth: bandWidth * 0.84,
      bars
    }
  })
})

const verticalGuides = computed(() =>
  groups.value.map((group, index) => ({
    key: group.key,
    index,
    x: group.centerX,
    isMajor: props.denseLabels ? index % 5 === 0 : true
  }))
)

const hoveredGroup = computed(() => {
  if (hoveredIndex.value === null) return null
  return groups.value[hoveredIndex.value] ?? null
})

const tooltip = computed(() => {
  const group = hoveredGroup.value
  if (!group) return null

  const lines = visibleSeries.value.map((series) => ({
    key: `${group.key}-${series}`,
    series,
    text: `${seriesLabel(series)}: ${fullMoney(group[series])}`
  }))

  const highestBarY = Math.min(...group.bars.map((bar) => bar.y))
  const placement = highestBarY <= PLOT_TOP + 10 ? 'below' : 'above'
  const top = placement === 'below' ? highestBarY + 1.6 : highestBarY - 0.8

  return {
    x: group.centerX,
    y: Math.max(1.5, top),
    placement,
    title: group.fullLabel,
    lines
  }
})

const tooltipStyle = computed(() => {
  if (!tooltip.value) return {}
  return {
    left: `${tooltip.value.x}%`,
    top: `${(tooltip.value.y / 64) * 100}%`
  }
})

const labelGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(normalizedItems.value.length, 1)}, minmax(0, 1fr))`
}))

function barHeight(value) {
  const numeric = Number(value || 0)
  if (numeric <= 0) return 0.36
  const ratio = Math.min(numeric / maxValue.value, 1)
  return Math.max(ratio * PLOT_HEIGHT, 0.9)
}

function shortMoney(value) {
  const numeric = Number(value || 0)
  if (numeric === 0) return '₽ 0'
  if (numeric >= 1000000) return `₽ ${(numeric / 1000000).toFixed(numeric % 1000000 === 0 ? 0 : 1)} млн`
  if (numeric >= 1000) return `₽ ${Math.round(numeric / 1000)} тыс.`
  return `₽ ${numeric.toLocaleString('ru-RU')}`
}

function fullMoney(value) {
  return `₽ ${Math.round(Number(value || 0)).toLocaleString('ru-RU')}`
}

function seriesLabel(series) {
  return series === 'income' ? 'Доходы' : 'Расходы'
}

function roundUpNice(value) {
  const numeric = Math.max(1, Number(value || 0))
  const exponent = Math.floor(Math.log10(numeric))
  const magnitude = 10 ** exponent
  const fraction = numeric / magnitude

  if (fraction <= 1) return 1 * magnitude
  if (fraction <= 2) return 2 * magnitude
  if (fraction <= 5) return 5 * magnitude
  return 10 * magnitude
}

function formatPeriod(key, denseLabels) {
  if (denseLabels) {
    const [year, month, day] = String(key).split('-')
    return {
      label: `${String(day || '').padStart(2, '0')}.${String(month || '').padStart(2, '0')}`,
      fullLabel: `${String(day || '').padStart(2, '0')}.${String(month || '').padStart(2, '0')}.${year || ''}`
    }
  }

  const [year, month] = String(key).split('-')
  const monthIndex = Number(month) - 1
  const monthNames = ['янв.', 'фев.', 'мар.', 'апр.', 'май.', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.']
  const monthName = monthNames[monthIndex] ?? key
  const shortYear = String(year || '').slice(-2)

  return {
    label: `${monthName}${shortYear ? shortYear : ''}`,
    fullLabel: `${capitalizeFirst(monthName)} ${year || ''}`.trim()
  }
}

function capitalizeFirst(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>
