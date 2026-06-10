export function useFormatters() {
  const formatPrice = (price) =>
    price === 0
      ? 'Бесплатно'
      : `${Number(price).toLocaleString('ru-RU')} ₽`

  const formatStudents = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1).replace('.0', '')}K`
    }
    return String(value)
  }

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('')

  const formatMonthYear = (dateString) => {
    if (!dateString) return 'недавно'
    return new Date(dateString).toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'только что'
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLevelBadgeClass = (level) => {
    if (level === 'beginner') return 'badge-beginner'
    if (level === 'intermediate') return 'badge-intermediate'
    return 'badge-advanced'
  }

  return {
    formatPrice,
    formatStudents,
    getInitials,
    formatMonthYear,
    formatDateTime,
    getLevelBadgeClass
  }
}
