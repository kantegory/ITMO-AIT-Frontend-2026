<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
})
</script>

<template>
    <div class="card">
        <div class="card-body">
            <dl class="mb-2">
                <dt class="text-muted mb-1">{{ title }}</dt>
                <dd class="h3 mb-0">{{ value }}</dd>
            </dl>
        </div>
    </div>
</template>
