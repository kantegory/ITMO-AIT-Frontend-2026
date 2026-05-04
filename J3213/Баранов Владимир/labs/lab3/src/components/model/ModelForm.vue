<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "cancel"]);

const form = ref({ name: "", version: "v1", framework: "PyTorch" });

function onSubmit() {
    emit("submit", {
        name: form.value.name.trim(),
        version: form.value.version.trim(),
        framework: form.value.framework,
    });
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-3">
            <label class="form-label">Название</label>
            <input v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="row g-2">
            <div class="col-md-4 mb-3">
                <label class="form-label">Версия</label>
                <input v-model="form.version" type="text" class="form-control" required />
            </div>
            <div class="col-md-8 mb-3">
                <label class="form-label">Фреймворк</label>
                <select v-model="form.framework" class="form-select">
                    <option>PyTorch</option>
                    <option>TensorFlow</option>
                    <option>scikit-learn</option>
                    <option>XGBoost</option>
                    <option>ONNX</option>
                </select>
            </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
                Отмена
            </button>
            <button type="submit" class="btn btn-primary">Зарегистрировать</button>
        </div>
    </form>
</template>
