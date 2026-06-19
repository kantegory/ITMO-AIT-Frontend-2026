<template>
    <NavBar />
    <main>
        <slot />
    </main>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>