export function useFormat() {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    if (dateString.includes('-')) {
      const parts = dateString.split('-')
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
      return dateString
    }
    return dateString
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU')
  }

  return { formatDate, formatPrice }
}
