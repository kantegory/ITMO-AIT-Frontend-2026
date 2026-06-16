export function useDateMask() {
  function normalizeDateInput(value) {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    const parts = []
    if (digits.slice(0, 2)) parts.push(digits.slice(0, 2))
    if (digits.slice(2, 4)) parts.push(digits.slice(2, 4))
    if (digits.slice(4, 8)) parts.push(digits.slice(4, 8))
    return parts.join('.')
  }

  function isValidDateString(value) {
    if (!/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(value)) return false
    const [d, m, y] = value.split('.').map(Number)
    const date = new Date(y, m - 1, d)
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  }

  function onDateInput(event) {
    event.target.value = normalizeDateInput(event.target.value)
    event.target.setCustomValidity('')
  }

  function onDateBlur(event) {
    const v = event.target.value.trim()
    if (!v) { event.target.setCustomValidity(''); return }
    event.target.setCustomValidity(isValidDateString(v) ? '' : 'Дата в формате ДД.ММ.ГГГГ')
    event.target.reportValidity()
  }

  return { normalizeDateInput, isValidDateString, onDateInput, onDateBlur }
}
