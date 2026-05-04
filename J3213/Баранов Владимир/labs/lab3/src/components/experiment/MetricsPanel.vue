<script setup>
import { ref } from "vue";

const props = defineProps({
    metrics: { type: Array, required: true },
});
const emit = defineEmits(["add", "remove"]);

const newName = ref("");
const newValue = ref("");

function onAdd() {
    if (!newName.value.trim()) return;
    emit("add", { name: newName.value.trim(), value: Number(newValue.value) });
    newName.value = "";
    newValue.value = "";
}
</script>

<template>
    <div class="card mb-3">
        <div class="card-body">
            <h2 class="h6 mb-3">Метрики</h2>
            <ul v-if="metrics.length" class="list-unstyled mb-3">
                <li
                    v-for="m in metrics"
                    :key="m.id"
                    class="d-flex justify-content-between align-items-center py-1 border-bottom"
                >
                    <span><strong>{{ m.name }}:</strong> {{ m.value }}</span>
                    <button
                        type="button"
                        class="btn btn-sm btn-link text-danger p-0"
                        @click="emit('remove', m)"
                    >
                        ✕
                    </button>
                </li>
            </ul>
            <p v-else class="text-muted small mb-3">Пока нет метрик</p>
            <form class="row g-2 align-items-end" @submit.prevent="onAdd">
                <div class="col-6">
                    <label class="form-label small mb-1">Метрика</label>
                    <input v-model="newName" class="form-control form-control-sm" required />
                </div>
                <div class="col-4">
                    <label class="form-label small mb-1">Значение</label>
                    <input
                        v-model="newValue"
                        type="number"
                        step="0.0001"
                        class="form-control form-control-sm"
                        required
                    />
                </div>
                <div class="col-2">
                    <button type="submit" class="btn btn-sm btn-primary w-100">+</button>
                </div>
            </form>
        </div>
    </div>
</template>
