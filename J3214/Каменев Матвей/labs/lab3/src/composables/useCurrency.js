import { ref, reactive, computed } from 'vue'
import { ratesApi } from '@/api'

const SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' }

function storageGet() {
  try {
    return localStorage.getItem('currency')
  } catch {
    return null
  }
}

function storageSet(value) {
  try {
    localStorage.setItem('currency', value)
  } catch {
  }
}

const selected = ref(storageGet() || 'RUB')
const rates = reactive({ RUB: 1, USD: null, EUR: null })
const ratesLoaded = ref(false)
let ratesRequest = null

function loadRates() {
  ratesRequest ??= ratesApi
    .getLatest('RUB')
    .then(({ data }) => {
      rates.USD = data.rates.USD
      rates.EUR = data.rates.EUR
      ratesLoaded.value = true
    })
    .catch(() => {})

  return ratesRequest
}

const useCurrency = () => {
  loadRates()

  const currency = computed(() => (ratesLoaded.value ? selected.value : 'RUB'))

  function setCurrency(value) {
    selected.value = value
    storageSet(value)
  }

  function formatPrice(rub, suffix = '') {
    const symbol = SYMBOLS[currency.value]

    if (currency.value === 'RUB') {
      const formatted = rub.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
      return suffix ? `${formatted} ${symbol} ${suffix}` : `${formatted} ${symbol}`
    }

    const converted = (rub * rates[currency.value]).toFixed(2)
    return suffix ? `${symbol}${converted} ${suffix}` : `${symbol}${converted}`
  }

  return { currency, ratesLoaded, setCurrency, formatPrice }
}

export default useCurrency
