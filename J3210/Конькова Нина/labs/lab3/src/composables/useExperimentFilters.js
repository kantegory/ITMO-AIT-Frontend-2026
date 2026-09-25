const { ref, computed } = window.Vue;

export function useExperimentFilters(experiments) {
    const search = ref('');
    const status = ref('All');
    const date = ref('');
    const minAccuracy = ref(0);

    const filteredExperiments = computed(() => {
        return experiments.filter((experiment) => {
            const matchesSearch = experiment.name.toLowerCase().includes(search.value.trim().toLowerCase());
            const matchesStatus = status.value === 'All' || experiment.status === status.value;
            const matchesDate = !date.value || experiment.date === date.value;
            const matchesAccuracy = experiment.accuracy >= Number(minAccuracy.value);

            return matchesSearch && matchesStatus && matchesDate && matchesAccuracy;
        });
    });

    function resetFilters() {
        search.value = '';
        status.value = 'All';
        date.value = '';
        minAccuracy.value = 0;
    }

    return {
        search,
        status,
        date,
        minAccuracy,
        filteredExperiments,
        resetFilters
    };
}
