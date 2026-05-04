<script setup>
import { ref, onMounted } from "vue";
import { useModels } from "@/composables/useModels.js";

const emit = defineEmits(["submit", "cancel"]);

const { fetchActiveForSelect } = useModels();
const models = ref([]);

const form = ref({
    name: "",
    metricName: "Accuracy",
    stage: "Train",
    modelId: "",
    metricValue: "",
    tags: "",
    description: "",
});

onMounted(async () => {
    try {
        models.value = await fetchActiveForSelect();
    } catch {
        models.value = [];
    }
});

function onSubmit() {
    const selected = models.value.find((m) => Number(m.id) === Number(form.value.modelId));
    const payload = {
        name: form.value.name.trim(),
        metricName: form.value.metricName,
        stage: form.value.stage,
        modelId: selected ? Number(selected.id) : null,
        modelName: selected ? selected.name : "",
        metricValue: form.value.metricValue === "" ? null : Number(form.value.metricValue),
        tags: form.value.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        description: form.value.description.trim(),
    };
    emit("submit", payload);
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-3">
            <label class="form-label">Название</label>
            <input v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="row g-2">
            <div class="col-md-6 mb-3">
                <label class="form-label">Метрика</label>
                <select v-model="form.metricName" class="form-select">
                    <option>Accuracy</option>
                    <option>ROC-AUC</option>
                    <option>F1-score</option>
                    <option>Precision</option>
                    <option>Recall</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Этап</label>
                <select v-model="form.stage" class="form-select">
                    <option>DataPrep</option>
                    <option>Train</option>
                    <option>Eval</option>
                    <option>DeployCheck</option>
                </select>
            </div>
        </div>
        <div class="row g-2">
            <div class="col-md-7 mb-3">
                <label class="form-label">Модель</label>
                <select v-model="form.modelId" class="form-select" required>
                    <option value="" disabled>Выберите модель</option>
                    <option v-for="m in models" :key="m.id" :value="m.id">
                        {{ m.name }} ({{ m.version }})
                    </option>
                </select>
                <small v-if="models.length === 0" class="text-muted">
                    Нет активных моделей — сначала зарегистрируйте модель в разделе Модели.
                </small>
            </div>
            <div class="col-md-5 mb-3">
                <label class="form-label">Значение метрики</label>
                <input
                    v-model="form.metricValue"
                    type="number"
                    step="0.0001"
                    min="0"
                    max="1"
                    class="form-control"
                    placeholder="0.91"
                />
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Теги (через запятую)</label>
            <input v-model="form.tags" type="text" class="form-control" placeholder="image, baseline" />
        </div>
        <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea v-model="form.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
                Отмена
            </button>
            <button type="submit" class="btn btn-primary">Создать</button>
        </div>
    </form>
</template>
