import { ref, computed } from 'vue'

// логика фильтрации событий
export function useEventFilters(eventsSource) {
    const search = ref('')
    const selectedGoal = ref('all')
    const selectedPlace = ref('all')

    const filteredEvents = computed(() => {
        return eventsSource.value.filter(event => {
            const q = search.value.trim().toLowerCase()
            const matchSearch = !q || `${event.title} ${event.description}`.toLowerCase().includes(q)
            const matchGoal = selectedGoal.value === 'all' || event.goal === selectedGoal.value
            const matchPlace = selectedPlace.value === 'all' || event.place === selectedPlace.value
            return matchSearch && matchGoal && matchPlace
        })
    })

    function resetFilters() {
        search.value = ''
        selectedGoal.value = 'all'
        selectedPlace.value = 'all'
    }

    return { search, selectedGoal, selectedPlace, filteredEvents, resetFilters }
}