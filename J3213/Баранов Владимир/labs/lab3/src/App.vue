<script setup>
import AppNavbar from "@/components/layout/AppNavbar.vue";
import ToastContainer from "@/components/ui/ToastContainer.vue";
</script>

<template>
    <AppNavbar />
    <main>
        <RouterView />
    </main>
    <ToastContainer />
</template>
