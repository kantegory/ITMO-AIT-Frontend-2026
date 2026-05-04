<script setup>
import { computed } from "vue";
import { useTableSort } from "@/composables/useTableSort.js";

const props = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
    experimentsByDataset: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["delete", "show-experiments"]);

const filtered = computed(() => {
    const q = props.search.trim().toLowerCase();
    if (!q) return props.items;
    return props.items.filter(
        (d) =>
            d.name?.toLowerCase().includes(q) ||
            d.type?.toLowerCase().includes(q) ||
            d.description?.toLowerCase().includes(q)
    );
});

const { sorted, toggle, headerClass } = useTableSort(filtered, "date", "desc");

function expCount(datasetId) {
    return props.experimentsByDataset[datasetId] || 0;
}
</script>

<template>
    <div class="table-responsive">
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th :class="headerClass('name')" @click="toggle('name')">Название</th>
                    <th :class="headerClass('type')" @click="toggle('type')">Тип</th>
                    <th :class="headerClass('size')" @click="toggle('size')">Размер</th>
                    <th>Описание</th>
                    <th>Эксперименты</th>
                    <th :class="headerClass('date')" @click="toggle('date')">Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="d in sorted" :key="d.id">
                    <td>{{ d.name }}</td>
                    <td>{{ d.type }}</td>
                    <td>{{ d.size || "—" }}</td>
                    <td>
                        <span class="text-muted small">{{ d.description || "—" }}</span>
                    </td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-sm btn-link p-0"
                            :disabled="expCount(d.id) === 0"
                            @click="emit('show-experiments', d)"
                        >
                            {{ expCount(d.id) }} шт.
                        </button>
                    </td>
                    <td>{{ d.date }}</td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-sm btn-danger"
                            @click="emit('delete', d)"
                        >
                            Удалить
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
