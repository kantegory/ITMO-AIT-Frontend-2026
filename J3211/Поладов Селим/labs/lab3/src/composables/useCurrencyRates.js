import { ref } from 'vue'
import axios from 'axios'

const RATES_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'

export function useCurrencyRates() {
  const usdRub = ref(null)
  const eurRub = ref(null)
  const date = ref('')

  async function load() {
    const { data } = await axios.get(RATES_URL)
    usdRub.value = data.usd.rub
    eurRub.value = data.usd.rub / data.usd.eur
    date.value = data.date
  }

  return { usdRub, eurRub, date, load }
}
