import { ref, computed } from 'vue'

export function useListFilter(list, matchFn) {
  const search      = ref('')
  const extraFilter = ref('')

  const activeSearch = ref('')
  const activeExtra  = ref('')

  const filtered = computed(() =>
    list.value.filter(item => matchFn(item, activeSearch.value, activeExtra.value))
  )

  function apply() {
    activeSearch.value = search.value
    activeExtra.value  = extraFilter.value
  }

  function reset() {
    search.value      = ''
    extraFilter.value = ''
    activeSearch.value = ''
    activeExtra.value  = ''
  }

  return { search, extraFilter, filtered, apply, reset }
}
