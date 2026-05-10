<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const activeTab = ref('currencies')

const currencies = ref([])
const metals = ref([])
const stocks = ref([])

const loadingCurrencies = ref(true)
const loadingMetals = ref(true)
const loadingStocks = ref(true)

const loadCurrencies = async () => {
  try {
    const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js')
    const valutesToShow = ['USD', 'EUR', 'CNY']
    currencies.value = valutesToShow.map(code => response.data.Valute[code])
  } catch (error) {
    console.error(error)
  } finally {
    loadingCurrencies.value = false
  }
}

const loadMetals = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  metals.value = [
    { name: "Золото", code: "XAU", price: 6850.40, trend: "+45.20", isUp: true, color: "#ffc107" },
    { name: "Серебро", code: "XAG", price: 82.15, trend: "-1.10", isUp: false, color: "#6c757d" },
    { name: "Платина", code: "XPT", price: 3100.00, trend: "+12.50", isUp: true, color: "#0dcaf0" }
  ]
  loadingMetals.value = false
}

const loadStocks = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  stocks.value = [
    { name: "Сбербанк", ticker: "SBER", price: 295.50, percent: "+1.2%", isUp: true, domain: "sberbank.ru" },
    { name: "Яндекс", ticker: "YNDX", price: 3450.00, percent: "-0.5%", isUp: false, domain: "yandex.ru" },
    { name: "Газпром", ticker: "GAZP", price: 164.20, percent: "+0.8%", isUp: true, domain: "gazprom.ru" }
  ]
  loadingStocks.value = false
}

onMounted(() => {
  loadCurrencies()
  loadMetals()
  loadStocks()
})
</script>

<template>
  <div class="card shadow-sm mb-4" style="border-radius: 15px; overflow: hidden;">
    <header class="card-header bg-white border-bottom-0 pt-3 pb-0">
      <ul class="nav nav-tabs border-bottom-0" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link border-0"
            :class="activeTab === 'currencies' ? 'active text-success fw-bold' : 'text-muted'"
            @click="activeTab = 'currencies'"
            type="button"
          >
            <i class="bi bi-currency-exchange me-1"></i> Валюты
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link border-0"
            :class="activeTab === 'metals' ? 'active text-success fw-bold' : 'text-muted'"
            @click="activeTab = 'metals'"
            type="button"
          >
            <i class="bi bi-minecart me-1"></i> Металлы
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link border-0"
            :class="activeTab === 'stocks' ? 'active text-success fw-bold' : 'text-muted'"
            @click="activeTab = 'stocks'"
            type="button"
          >
            <i class="bi bi-graph-up-arrow me-1"></i> Акции
          </button>
        </li>
      </ul>
    </header>

    <div class="card-body bg-light">
      <div v-if="activeTab === 'currencies'" class="row g-3">
        <div v-if="loadingCurrencies" class="text-center text-muted small w-100">
          <div class="spinner-border spinner-border-sm text-success" role="status"></div> Загрузка валют...
        </div>
        <div v-else v-for="valute in currencies" :key="valute.ID" class="col-md-4">
          <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-muted">{{ valute.Name }}</span>
                <span class="badge bg-light text-dark border">{{ valute.CharCode }}</span>
              </div>
              <h3 class="mb-0 fw-bold">{{ valute.Value.toFixed(2) }} ₽</h3>
              <div class="small mt-1 fw-bold" :class="valute.Value > valute.Previous ? 'text-danger' : 'text-success'">
                <i class="bi" :class="valute.Value > valute.Previous ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i>
                {{ Math.abs((valute.Value - valute.Previous).toFixed(2)) }} ₽
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'metals'" class="row g-3">
        <div v-if="loadingMetals" class="text-center text-muted small w-100">
          <div class="spinner-border spinner-border-sm text-warning" role="status"></div> Загрузка металлов...
        </div>
        <div v-else v-for="metal in metals" :key="metal.code" class="col-md-4">
          <div class="card shadow-sm border-0 h-100" :style="{ borderRadius: '15px', borderLeft: `4px solid ${metal.color} !important` }">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
                <div class="fw-bold text-muted lh-sm">
                  {{ metal.name }}
                  <div class="fw-normal" style="font-size: 0.75em;">(за 1 грамм)</div>
                </div>
                <span class="badge bg-light text-dark border flex-shrink-0">{{ metal.code }}</span>
              </div>
              <h3 class="mb-0 fw-bold">{{ metal.price.toFixed(2) }} ₽</h3>
              <div class="small mt-1 fw-bold" :class="metal.isUp ? 'text-success' : 'text-danger'">
                <i class="bi" :class="metal.isUp ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i> {{ metal.trend }} ₽
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'stocks'" class="row g-3">
        <div v-if="loadingStocks" class="text-center text-muted small w-100">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div> Загрузка акций...
        </div>
        <div v-else v-for="stock in stocks" :key="stock.ticker" class="col-md-4">
          <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
                <div class="fw-bold text-muted d-flex align-items-center">
                  <img :src="`https://www.google.com/s2/favicons?domain=${stock.domain}&sz=64`" alt="logo" width="20" height="20" class="me-2 rounded-circle">
                  {{ stock.name }}
                </div>
                <span class="badge bg-light text-dark border flex-shrink-0">{{ stock.ticker }}</span>
              </div>
              <h3 class="mb-0 fw-bold">{{ stock.price.toFixed(2) }} ₽</h3>
              <div class="small mt-1 fw-bold" :class="stock.isUp ? 'text-success' : 'text-danger'">
                <i class="bi" :class="stock.isUp ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i> {{ stock.percent }} за день
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
