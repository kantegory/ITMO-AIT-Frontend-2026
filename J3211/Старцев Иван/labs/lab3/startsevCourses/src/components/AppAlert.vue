<script setup>
defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        default: 'secondary',
    },
    text: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <div v-if="visible" :class="`alert alert-${type}`" role="alert">
        {{ text }}
    </div>
</template>
