<script setup>
defineProps({
    label: String,
    value: [Number, String],
})
</script>

<template>
    <div class="stat card">
        <div class="value">{{ value }}</div>
        <div class="muted">{{ label }}</div>
    </div>
</template>

<style scoped>
.stat { 
    text-align: center; 
}
.value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
}
</style>