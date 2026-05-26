<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    compact: {
        type: Boolean,
        default: false
    },
    addable: {
        type: Boolean,
        default: false
    }
});
defineEmits(["add"]);
</script>

<template>
    <div class="card card-item p-3 h-100 border-0 shadow-sm">
        <h6 class="fw-semibold">
            <RouterLink :to="`/${kind}/${item.id}`" class="text-decoration-none text-dark">{{ item.name }}</RouterLink>
        </h6>
        <div class="text-muted small mb-2">{{ item.framework || item.format || item.type }}</div>
        <p v-if="!compact && item.description" class="text-muted small mb-3">{{ item.description }}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="tag">{{ item.tag || item.updates }}</span>
            <button v-if="addable" class="btn btn-primary btn-sm" type="button" :aria-label="`Добавить ${item.name}`" @click="$emit('add', item.id)">Добавить</button>
        </div>
    </div>
</template>
