<script setup>
defineProps({
    comment: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="mb-3 border-bottom pb-2">
        <div class="d-flex justify-content-between align-items-center">
            <strong class="small">{{ comment.userName }}</strong>
        </div>
        <div class="small mt-1">{{ comment.text }}</div>
    </div>
</template>
