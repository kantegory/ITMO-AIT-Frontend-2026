export function useFormat() {
  function compactNumber(value) {
    return new Intl.NumberFormat('ru-RU', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value || 0)
  }

  return {
    compactNumber
  }
}
