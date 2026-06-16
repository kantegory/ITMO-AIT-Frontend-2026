<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    }
});
</script>

<template>
    <article class="stat-card">
        <h2>{{ title }}</h2>
        <p>{{ value }}</p>
    </article>
</template>
