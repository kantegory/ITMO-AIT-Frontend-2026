const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit', month: '2-digit', year: 'numeric'
})

const dateTimeFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })

export const CATEGORY_EMOJI = {
  'Продукты': '🛒', 'Транспорт': '🚗', 'Развлечения': '🎬',
  'Доход': '💵', 'Крупная покупка': '🚘', 'Авто': '🚗',
  'Жильё': '🏠', 'Крупные траты': '💰', 'Техника': '💻', 'Накопления': '🏦'
}

export function useFormatters() {
  const formatDate = (value) => value ? dateFmt.format(new Date(value)) : ''
  const formatDateTime = (value) => value ? dateTimeFmt.format(new Date(value)) : ''
  const formatMonth = (value) => value ? monthFmt.format(new Date(value)) : ''

  const formatMoney = (value) => `${Number(value).toLocaleString('ru-RU')} ₽`

  const formatSignedMoney = (value) => {
    const n = Number(value)
    if (n < 0) return `− ${Math.abs(n).toLocaleString('ru-RU')} ₽`
    return `+ ${n.toLocaleString('ru-RU')} ₽`
  }

  const categoryEmoji = (category) => CATEGORY_EMOJI[category] || '💳'

  return { formatDate, formatDateTime, formatMonth, formatMoney, formatSignedMoney, categoryEmoji }
}
