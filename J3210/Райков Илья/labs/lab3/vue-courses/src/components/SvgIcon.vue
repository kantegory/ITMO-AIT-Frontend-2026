<template>
    <svg class="icon" aria-hidden="true">
        <use :href="`/img/sprite.svg#${name}`"></use>
    </svg>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true
    }
});
</script>