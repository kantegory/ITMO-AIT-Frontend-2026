import { ref, computed } from 'vue'

export function useCourses(allCourses) {
  const search  = ref('')
  const subject = ref('')
  const level   = ref('')
  const price   = ref('')

  const filtered = computed(() => {
    return allCourses.value.filter(c => {
      const hay = `${c.title} ${c.subject} ${c.author}`.toLowerCase()

      if (search.value && !hay.includes(search.value.toLowerCase())) return false
      if (subject.value && c.subject !== subject.value) return false
      if (level.value   && c.level   !== level.value)   return false
      if (price.value === 'free' && c.price !== 0)       return false
      if (price.value === '1000' && c.price > 1000)      return false
      if (price.value === '3000' && c.price > 3000)      return false

      return true
    })
  })

  function resetFilters() {
    search.value  = ''
    subject.value = ''
    level.value   = ''
    price.value   = ''
  }

  return { search, subject, level, price, filtered, resetFilters }
}
