<script setup>
import { computed } from "vue";
import { useTableSort } from "@/composables/useTableSort.js";
import StatusBadge from "@/components/ui/StatusBadge.vue";

const props = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
    experimentsByModel: { type: Object, default: () => ({}) },
    highlightId: { type: [Number, String], default: null },
});
const emit = defineEmits(["update-status", "delete", "show-experiments"]);

const filtered = computed(() => {
    const q = props.search.trim().toLowerCase();
    if (!q) return props.items;
    return props.items.filter(
        (m) =>
            m.name?.toLowerCase().includes(q) ||
            m.framework?.toLowerCase().includes(q) ||
            m.version?.toLowerCase().includes(q)
    );
});

const { sorted, toggle, headerClass } = useTableSort(filtered, "date", "desc");

function isHighlighted(id) {
    return props.highlightId && Number(props.highlightId) === Number(id);
}

function expCount(modelId) {
    return props.experimentsByModel[modelId] || 0;
}
</script>

<template>
    <div class="table-responsive">
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th :class="headerClass('name')" @click="toggle('name')">Название</th>
                    <th :class="headerClass('version')" @click="toggle('version')">Версия</th>
                    <th :class="headerClass('framework')" @click="toggle('framework')">Фреймворк</th>
                    <th>Статус</th>
                    <th>Эксперименты</th>
                    <th :class="headerClass('date')" @click="toggle('date')">Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="m in sorted" :key="m.id" :class="{ 'highlight-row': isHighlighted(m.id) }">
                    <td>{{ m.name }}</td>
                    <td>{{ m.version }}</td>
                    <td>{{ m.framework || "—" }}</td>
                    <td><StatusBadge :status="m.status" /></td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-sm btn-link p-0"
                            :disabled="expCount(m.id) === 0"
                            @click="emit('show-experiments', m)"
                        >
                            {{ expCount(m.id) }} шт.
                        </button>
                    </td>
                    <td>{{ m.date }}</td>
                    <td>
                        <div class="d-flex flex-wrap gap-1">
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-success"
                                :disabled="m.status === 'В проде'"
                                @click="emit('update-status', m, 'В проде')"
                            >
                                Deploy
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary"
                                :disabled="m.status === 'Архив'"
                                @click="emit('update-status', m, 'Архив')"
                            >
                                Archive
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-danger"
                                @click="emit('delete', m)"
                            >
                                Удалить
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
