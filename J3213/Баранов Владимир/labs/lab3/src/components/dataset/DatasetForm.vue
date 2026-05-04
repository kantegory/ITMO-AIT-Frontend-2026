<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "cancel"]);

const form = ref({
    name: "",
    type: "image",
    size: "",
    description: "",
});

function onSubmit() {
    emit("submit", {
        name: form.value.name.trim(),
        type: form.value.type,
        size: form.value.size.trim(),
        description: form.value.description.trim(),
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
            <div class="col-md-5 mb-3">
                <label class="form-label">Тип</label>
                <select v-model="form.type" class="form-select">
                    <option value="image">image</option>
                    <option value="text">text</option>
                    <option value="tabular">tabular</option>
                    <option value="audio">audio</option>
                    <option value="video">video</option>
                    <option value="other">other</option>
                </select>
            </div>
            <div class="col-md-7 mb-3">
                <label class="form-label">Размер</label>
                <input
                    v-model="form.size"
                    type="text"
                    class="form-control"
                    placeholder="Например, 60 000 samples"
                />
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea v-model="form.description" class="form-control" rows="2"></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
                Отмена
            </button>
            <button type="submit" class="btn btn-primary">Зарегистрировать</button>
        </div>
    </form>
</template>
