const EVENT_TYPES = [
  { value: 'concert', label: 'Концерт' },
  { value: 'theatre', label: 'Театр' },
  { value: 'exhibition', label: 'Выставка' }
]

const labelByValue = Object.fromEntries(EVENT_TYPES.map((t) => [t.value, t.label]))

export default function useEventTypes() {
  const typeLabel = (value) => labelByValue[value] || 'Мероприятие'
  const typeOptions = EVENT_TYPES
  return { typeLabel, typeOptions }
}
