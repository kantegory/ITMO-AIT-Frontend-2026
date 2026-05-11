export function normalizeEventsList(data) {
  if (data == null) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'object' && Array.isArray(data.events)) return data.events
  if (typeof data === 'object') {
    const vals = Object.values(data)
    if (
      vals.length &&
      vals.every((x) => x != null && typeof x === 'object' && 'id' in x)
    ) {
      return vals
    }
  }
  return []
}

export function findEventInList(list, idStr) {
  if (!Array.isArray(list)) return null
  const sid = String(idStr).trim()
  const num = Number(sid)
  const useNum = !Number.isNaN(num) && sid !== ''
  return (
    list.find((e) => {
      if (e == null || e.id == null) return false
      if (String(e.id).trim() === sid) return true
      if (useNum && Number(e.id) === num) return true
      return false
    }) ?? null
  )
}

export function applyEventFilters(events, filters) {
  const query = (filters.query ?? '').trim().toLowerCase()
  const type = filters.type ?? ''
  const dateFilter = (filters.date ?? '').trim()
  const city = filters.city ?? ''
  return events.filter((event) => {
    const matchesQuery =
      !query ||
      (event.title && event.title.toLowerCase().includes(query)) ||
      (event.description && event.description.toLowerCase().includes(query))
    const matchesType = !type || event.type === type
    const matchesDate = !dateFilter || event.date === dateFilter
    const matchesCity = !city || event.city === city
    return matchesQuery && matchesType && matchesDate && matchesCity
  })
}
