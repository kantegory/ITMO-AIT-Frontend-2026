export function useFormatters() {
  function formatMoney(value, options = {}) {
    const normalized = options.round ? Math.round(value) : value
    return `${normalized.toLocaleString('ru-RU')} ₽`
  }

  function formatSignedAmount(value) {
    return `${value > 0 ? '+' : '-'} ${Math.abs(value).toLocaleString('ru-RU')} ₽`
  }

  function formatDate(dateISO) {
    return new Date(dateISO).toLocaleDateString('ru-RU')
  }

  return {
    formatMoney,
    formatSignedAmount,
    formatDate
  }
}
