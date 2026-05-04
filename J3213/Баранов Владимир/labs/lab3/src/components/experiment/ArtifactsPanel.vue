<script setup>
import { ref } from "vue";

const props = defineProps({
    artifacts: { type: Array, required: true },
});
const emit = defineEmits(["add", "remove"]);

const newName = ref("");
const newType = ref("model");

function onAdd() {
    if (!newName.value.trim()) return;
    emit("add", { name: newName.value.trim(), type: newType.value });
    newName.value = "";
    newType.value = "model";
}
</script>

<template>
    <div class="card mb-3">
        <div class="card-body">
            <h2 class="h6 mb-3">Артефакты</h2>
            <ul v-if="artifacts.length" class="list-unstyled mb-3">
                <li
                    v-for="a in artifacts"
                    :key="a.id"
                    class="d-flex justify-content-between align-items-center py-1 border-bottom"
                >
                    <span>
                        {{ a.name }}
                        <span class="text-muted small">({{ a.type }})</span>
                    </span>
                    <button
                        type="button"
                        class="btn btn-sm btn-link text-danger p-0"
                        @click="emit('remove', a)"
                    >
                        x
                    </button>
                </li>
            </ul>
            <p v-else class="text-muted small mb-3">Артефактов пока нет</p>
            <form class="row g-2 align-items-end" @submit.prevent="onAdd">
                <div class="col-6">
                    <label class="form-label small mb-1">Название</label>
                    <input v-model="newName" class="form-control form-control-sm" required />
                </div>
                <div class="col-4">
                    <label class="form-label small mb-1">Тип</label>
                    <select v-model="newType" class="form-select form-select-sm">
                        <option value="model">model</option>
                        <option value="image">image</option>
                        <option value="config">config</option>
                        <option value="metrics">metrics</option>
                        <option value="other">other</option>
                    </select>
                </div>
                <div class="col-2">
                    <button type="submit" class="btn btn-sm btn-primary w-100">+</button>
                </div>
            </form>
        </div>
    </div>
</template>
