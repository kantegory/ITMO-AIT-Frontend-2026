import { ref } from 'vue'

const rates = ref({
  '₽': 1,
  $: 90,
  '€': 100,
})

export function useMoney() {
  function setRates(payload) {
    if (payload.usd) rates.value.$ = payload.usd
    if (payload.eur) rates.value['€'] = payload.eur
  }

  function convertToRubles(amount, currency = '₽') {
    const value = Number(amount) || 0

    if (currency === '$') return value * rates.value.$
    if (currency === '€') return value * rates.value['€']

    return value
  }

  function formatRubles(amount) {
    return `${Number(amount || 0).toLocaleString('ru-RU')} ₽`
  }

  return {
    rates,
    setRates,
    convertToRubles,
    formatRubles,
  }
}
