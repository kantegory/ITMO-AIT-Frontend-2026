<script setup>
import { onMounted, ref } from "vue";
import AppSidebar from "./AppSidebar.vue";
import { loadStore } from "../store.js";

const ready = ref(false);
const error = ref("");

onMounted(async () => {
    try {
        await loadStore();
        ready.value = true;
    } catch (reason) {
        error.value = "Не удалось подключиться к моковому API. Запустите npm run api";
    }
});
</script>

<template>
    <div class="d-flex dashboard">
        <AppSidebar />
        <main class="flex-grow-1">
            <div v-if="error" class="alert alert-danger m-4" role="alert">{{ error }}</div>
            <RouterView v-else-if="ready" />
        </main>
    </div>
</template>
