<script setup>
defineProps({
    title: String,
    isActive: Boolean
})
defineEmits(['select'])
</script>

<template>
    <button
        @click="$emit('select')"
        :class="['list-group-item list-group-item-action', { active: isActive }]"
    >
        <small class="fw-bold">{{ title }}</small>
    </button>
</template>
