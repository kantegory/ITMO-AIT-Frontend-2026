<script setup>
defineProps(['title'])
defineEmits(['download'])
</script>

<template>
    <div class="col-md-6">
        <div
            class="card p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
                <h3 class="mb-0 fw-bold h6">{{ title }}</h3>
                <small class="text-muted">Курс пройден</small>
            </div>
            <button class="btn btn-sm border" @click="$emit('download')">PDF</button>
        </div>
    </div>
</template>
