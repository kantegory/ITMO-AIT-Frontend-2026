<script setup>
import { computed } from "vue";

const props = defineProps({
    status: { type: String, required: true },
});

const STATUS_TO_CLASS = {
    Running: "status-pill--running",
    Completed: "status-pill--completed",
    Failed: "status-pill--failed",
    Draft: "status-pill--draft",
    "В проде": "status-pill--prod",
    Тестирование: "status-pill--testing",
    Архив: "status-pill--archive",
};

const cls = computed(() => STATUS_TO_CLASS[props.status] || "status-pill--draft");
</script>

<template>
    <span class="status-pill" :class="cls">{{ status }}</span>
</template>
