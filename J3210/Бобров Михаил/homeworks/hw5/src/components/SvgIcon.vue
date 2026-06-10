<script setup>
defineProps({
    name: {
        type: String,
        required: true
    }
});

const path = `${import.meta.env.BASE_URL}sprite.svg`;
</script>

<template>
    <svg class="icon" aria-hidden="true"><use :href="`${path}#${name}`" /></svg>
</template>
