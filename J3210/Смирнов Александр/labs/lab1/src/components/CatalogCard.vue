<template>
    <div class="item-card h-100">
        <div class="d-flex justify-content-between align-items-start">
            <h3 class="h5">
                <RouterLink :to="`/model/${item.id}`" class="text-decoration-none text-dark">{{ item.name }}</RouterLink>
            </h3>
            <span class="badge" :class="item.type === 'model' ? 'bg-primary' : 'bg-success'">{{ item.type.toUpperCase() }}</span>
        </div>

        <p class="text-muted small mb-2">
            Task: {{ item.task.toUpperCase() }} | License: {{ item.license.toUpperCase() }} | Size: {{ item.size }}
        </p>
        <p>{{ item.desc }}</p>

        <div class="d-flex gap-2 mb-3">
            <span class="badge bg-secondary">Downloads: {{ item.downloads }}</span>
        </div>

        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-sm"
                :class="isStarred ? 'btn-warning' : 'btn-outline-warning'"
                :aria-label="`Toggle star for ${item.name}`"
                @click="emit('toggle-star', item)"
            >
                <svg class="icon me-1" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                    <path
                        fill="currentColor"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"
                    />
                </svg>
                {{ item.stars }}
            </button>
            <button
                type="button"
                class="btn btn-sm"
                :class="isSubscribed ? 'btn-outline-danger' : 'btn-outline-primary'"
                :aria-label="`${isSubscribed ? 'Unsubscribe from' : 'Subscribe to'} ${item.name}`"
                @click="emit('toggle-subscription', item.id)"
            >
                {{ isSubscribed ? "Unsubscribe" : "Subscribe" }}
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    isStarred: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["toggle-star", "toggle-subscription"]);
</script>
