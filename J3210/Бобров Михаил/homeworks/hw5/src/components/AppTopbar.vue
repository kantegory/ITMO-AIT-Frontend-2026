<script setup>
import ThemeToggle from "./ThemeToggle.vue";

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="topbar px-4 py-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <slot name="before" />
            <h1 class="page-title mb-0">{{ title }}</h1>
        </div>
        <div class="d-flex align-items-center gap-2">
            <slot name="actions" />
            <ThemeToggle />
        </div>
    </div>
</template>
