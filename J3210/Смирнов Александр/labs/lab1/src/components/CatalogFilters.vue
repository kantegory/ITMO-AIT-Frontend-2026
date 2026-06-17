<template>
    <aside class="col-md-3" aria-label="Catalog filters">
        <div class="sidebar-filters">
            <h4>Filters</h4>
            <hr />

            <label for="filter-type" class="form-label fw-bold small">Type</label>
            <select id="filter-type" class="form-select form-select-sm mb-3" :value="type" @change="emit('update:type', $event.target.value)">
                <option value="all">All</option>
                <option value="model">Models</option>
                <option value="dataset">Datasets</option>
            </select>

            <label for="filter-task" class="form-label fw-bold small">Task</label>
            <select id="filter-task" class="form-select form-select-sm mb-3" :value="task" @change="emit('update:task', $event.target.value)">
                <option value="all">All</option>
                <option value="cv">Computer Vision</option>
                <option value="nlp">NLP</option>
            </select>

            <label for="filter-license" class="form-label fw-bold small">License</label>
            <select id="filter-license" class="form-select form-select-sm mb-3" :value="license" @change="emit('update:license', $event.target.value)">
                <option value="all">All</option>
                <option value="mit">MIT</option>
                <option value="apache">Apache 2.0</option>
                <option value="cc">Creative Commons</option>
            </select>
        </div>
    </aside>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    license: {
        type: String,
        required: true
    }
});

const emit = defineEmits(["update:type", "update:task", "update:license"]);
</script>
