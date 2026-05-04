<script setup>
defineProps({
    text: { type: String, default: "Загрузка..." },
});
</script>

<template>
    <div class="loading-state">
        <div class="spinner-pl mb-2" role="status" aria-label="Загрузка"></div>
        <div>{{ text }}</div>
    </div>
</template>
