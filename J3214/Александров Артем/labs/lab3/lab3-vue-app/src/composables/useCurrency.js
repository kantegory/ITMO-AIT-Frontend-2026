import { ref } from 'vue'
import axios from 'axios'

const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/USD'

export function useCurrency() {
  const currencyRates = ref([
    { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺', rate: '--' },
    { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺', rate: '--' },
    { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳', rate: '--' },
    { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', flag: '🇬🇧', rate: '--' }
  ])
  
  const lastUpdate = ref('--:--')
  const isLoading = ref(false)

  const fetchRates = async () => {
    isLoading.value = true
    try {
      const response = await axios.get(CURRENCY_API_URL)
      const data = response.data
      if (data && data.rates) {
        currencyRates.value = currencyRates.value.map(curr => ({
          ...curr, // синтаксис распаковки всех полей объекта (curr)
          rate: data.rates[curr.code] ? data.rates[curr.code].toFixed(2) : 'N/A' // перезапись поля после распаковки
        }))
        const now = new Date()
        lastUpdate.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    } catch (err) {
      console.error('Ошибка внешнего курса валют:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    currencyRates,
    lastUpdate,
    isLoading,
    fetchRates
  }
}