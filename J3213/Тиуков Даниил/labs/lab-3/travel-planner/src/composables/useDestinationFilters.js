import { computed, reactive } from 'vue'
import { useDestinations } from './useDestinations.js'

const budgetRank = { low: 1, medium: 2, high: 3 }

export function useDestinationFilters(perPage = 6) {
  const { destinations } = useDestinations()

  const state = reactive({
    query: '',
    type: 'all',
    budget: 'any',
    duration: 'any',
    sort: 'rating-desc',
    sortLabel: 'Сначала лучшие',
    currentPage: 1,
    perPage
  })

  const filtered = computed(() => {
    const result = destinations.value.filter((destination) => {
      const matchesQuery = destination.name.toLowerCase().includes(state.query.trim().toLowerCase())
      const matchesType = state.type === 'all' || destination.type === state.type
      const matchesBudget = state.budget === 'any' || destination.budget === state.budget
      const matchesDuration = state.duration === 'any' || destination.durationCategory === state.duration
      return matchesQuery && matchesType && matchesBudget && matchesDuration
    })

    return [...result].sort((left, right) => {
      switch (state.sort) {
        case 'rating-asc':
          return left.rating - right.rating
        case 'budget-asc':
          return budgetRank[left.budget] - budgetRank[right.budget]
        case 'budget-desc':
          return budgetRank[right.budget] - budgetRank[left.budget]
        case 'duration-asc':
          return left.duration - right.duration
        case 'duration-desc':
          return right.duration - left.duration
        case 'rating-desc':
        default:
          return right.rating - left.rating
      }
    })
  })

  const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / state.perPage)))

  const visible = computed(() => {
    const page = Math.min(state.currentPage, pageCount.value)
    const start = (page - 1) * state.perPage
    return filtered.value.slice(start, start + state.perPage)
  })

  function reset() {
    state.query = ''
    state.type = 'all'
    state.budget = 'any'
    state.duration = 'any'
    state.sort = 'rating-desc'
    state.sortLabel = 'Сначала лучшие'
    state.currentPage = 1
  }

  function setSort(sort, label) {
    state.sort = sort
    if (label) state.sortLabel = label
    state.currentPage = 1
  }

  function setPage(pageNumber) {
    state.currentPage = pageNumber
  }

  return { state, filtered, visible, pageCount, reset, setSort, setPage }
}
