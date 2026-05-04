<script setup>
import Icon from "@/components/ui/Icon.vue";

defineProps({
    icon: { type: String, default: "artifactCube" },
    title: { type: String, default: "Пока ничего нет" },
    description: { type: String, default: "" },
});
</script>

<template>
    <div class="empty-state">
        <Icon :name="icon" class="empty-state__icon" />
        <h3 class="h5 mb-2">{{ title }}</h3>
        <p v-if="description" class="mb-3">{{ description }}</p>
        <slot />
    </div>
</template>
