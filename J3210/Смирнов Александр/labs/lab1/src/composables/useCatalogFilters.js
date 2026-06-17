import { computed, ref } from "vue";

export function useCatalogFilters(items) {
    const type = ref("all");
    const task = ref("all");
    const license = ref("all");
    const search = ref("");

    const filteredItems = computed(() => {
        return items.value.filter((item) => {
            const matchesType = type.value === "all" || item.type === type.value;
            const matchesTask = task.value === "all" || item.task === task.value;
            const matchesLicense = license.value === "all" || item.license === license.value;
            const matchesSearch = item.name.toLowerCase().includes(search.value.toLowerCase());

            return matchesType && matchesTask && matchesLicense && matchesSearch;
        });
    });

    return {
        type,
        task,
        license,
        search,
        filteredItems
    };
}
