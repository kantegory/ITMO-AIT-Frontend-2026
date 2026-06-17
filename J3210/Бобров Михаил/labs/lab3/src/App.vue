<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";
import { setupNavigation } from "./navigation.js";

let disposeNavigation;

onMounted(() => {
    disposeNavigation = setupNavigation();
});

onUnmounted(() => {
    disposeNavigation?.();
});
</script>

<template>
    <RouterView />
</template>
