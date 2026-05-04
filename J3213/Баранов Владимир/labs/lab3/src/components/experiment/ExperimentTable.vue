<script setup>
import { computed } from "vue";
import { useTableSort } from "@/composables/useTableSort.js";
import { normalizeStatus } from "@/composables/useExperiments.js";
import StatusBadge from "@/components/ui/StatusBadge.vue";

const props = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
});
const emit = defineEmits(["update-status", "delete"]);

const filtered = computed(() => {
    const q = props.search.trim().toLowerCase();
    if (!q) return props.items;
    return props.items.filter(
        (e) =>
            e.name?.toLowerCase().includes(q) ||
            e.modelName?.toLowerCase().includes(q) ||
            (e.tags || []).some((t) => t.toLowerCase().includes(q))
    );
});

const { sorted, toggle, headerClass } = useTableSort(filtered, "date", "desc");

function isDisabled(currentStatus, target) {
    return normalizeStatus(currentStatus) === target;
}
</script>

<template>
    <div class="table-responsive">
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th :class="headerClass('id')" @click="toggle('id')">ID</th>
                    <th :class="headerClass('name')" @click="toggle('name')">Название</th>
                    <th :class="headerClass('stage')" @click="toggle('stage')">Этап</th>
                    <th :class="headerClass('modelName')" @click="toggle('modelName')">Модель</th>
                    <th>Статус</th>
                    <th :class="headerClass('metricValue')" @click="toggle('metricValue')">Метрика</th>
                    <th :class="headerClass('date')" @click="toggle('date')">Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="exp in sorted" :key="exp.id">
                    <td>
                        <RouterLink :to="`/experiments/${exp.id}`">#{{ exp.id }}</RouterLink>
                    </td>
                    <td>{{ exp.name }}</td>
                    <td>{{ exp.stage }}</td>
                    <td>
                        <RouterLink
                            v-if="exp.modelId"
                            :to="{ name: 'models', query: { highlight: exp.modelId } }"
                        >
                            {{ exp.modelName }}
                        </RouterLink>
                        <span v-else class="text-muted">—</span>
                    </td>
                    <td><StatusBadge :status="normalizeStatus(exp.status)" /></td>
                    <td>
                        <span class="text-muted">{{ exp.metricName }}:</span>
                        {{ exp.metricValue ?? "—" }}
                    </td>
                    <td>{{ exp.date }}</td>
                    <td>
                        <div class="d-flex flex-wrap gap-1">
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                :disabled="isDisabled(exp.status, 'Running')"
                                @click="emit('update-status', exp, 'Running')"
                            >
                                Start
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-success"
                                :disabled="isDisabled(exp.status, 'Completed')"
                                @click="emit('update-status', exp, 'Completed')"
                            >
                                Finish
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-danger"
                                @click="emit('delete', exp)"
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
