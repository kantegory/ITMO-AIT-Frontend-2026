<script setup>
defineProps({
    name: { type: String, required: true },
    size: { type: String, default: "" },
});
</script>

<template>
    <svg class="icon" :class="size" aria-hidden="true" focusable="false">
        <use :href="`/sprite.svg#${name}`" />
    </svg>
</template>
