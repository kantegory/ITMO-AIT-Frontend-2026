export function cityLabel(city) {
  if (city === 'spb') return 'Санкт‑Петербург'
  if (city === 'msk') return 'Москва'
  if (city === 'nsk') return 'Новосибирск'
  if (city === 'ptz') return 'Петрозаводск'
  return city || ''
}

export function useCity() {
  return { cityLabel }
}
