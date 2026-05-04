<script setup>
const props = defineProps({
    modelValue: { type: Object, required: true },
});
const emit = defineEmits(["update:modelValue", "reset"]);

function update(key, value) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>

<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="row g-2 align-items-end">
                <div class="col-md-3">
                    <label class="form-label small mb-1">Дата</label>
                    <select
                        class="form-select"
                        :value="modelValue.dateRange"
                        @change="update('dateRange', $event.target.value)"
                    >
                        <option value="all">За всё время</option>
                        <option value="today">За сегодня</option>
                        <option value="week">За неделю</option>
                        <option value="month">За месяц</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label small mb-1">Метрика</label>
                    <select
                        class="form-select"
                        :value="modelValue.metric"
                        @change="update('metric', $event.target.value)"
                    >
                        <option value="">Любая</option>
                        <option value="Accuracy">Accuracy</option>
                        <option value="ROC-AUC">ROC-AUC</option>
                        <option value="F1-score">F1-score</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label small mb-1">Статус</label>
                    <select
                        class="form-select"
                        :value="modelValue.status"
                        @change="update('status', $event.target.value)"
                    >
                        <option value="">Любой</option>
                        <option value="Draft">Draft</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label small mb-1">Тег / название</label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Например, baseline"
                        :value="modelValue.tag"
                        @input="update('tag', $event.target.value)"
                    />
                </div>
                <div class="col-12 d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="$emit('reset')">
                        Сбросить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
