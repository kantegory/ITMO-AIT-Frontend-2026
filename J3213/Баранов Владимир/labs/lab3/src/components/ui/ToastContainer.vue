<script setup>
import { useToast } from "@/composables/useToast.js";

const { toasts, dismiss } = useToast();
</script>

<template>
    <div class="toast-stack" role="region" aria-live="polite" aria-label="Уведомления">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast-card"
            :class="`toast-card--${toast.level}`"
            @click="dismiss(toast.id)"
        >
            {{ toast.message }}
        </div>
    </div>
</template>
