import { ref, computed } from "vue";

export function useTableSort(items, defaultKey = "date", defaultDir = "desc") {
    const sortKey = ref(defaultKey);
    const sortDir = ref(defaultDir);

    function toggle(key) {
        if (sortKey.value === key) {
            sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
        } else {
            sortKey.value = key;
            sortDir.value = "asc";
        }
    }

    const sorted = computed(() => {
        const arr = [...items.value];
        const key = sortKey.value;
        const dirMul = sortDir.value === "asc" ? 1 : -1;
        arr.sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            if (typeof av === "number" && typeof bv === "number") return (av - bv) * dirMul;
            return String(av).localeCompare(String(bv), "ru") * dirMul;
        });
        return arr;
    });

    function headerClass(key) {
        if (sortKey.value !== key) return "sortable";
        return `sortable sort-${sortDir.value}`;
    }

    return { sortKey, sortDir, sorted, toggle, headerClass };
}
