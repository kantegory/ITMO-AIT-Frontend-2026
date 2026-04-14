<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
</script>

<template>
    <div class="main-layout">
        <AppNavbar/>
        <slot/>
    </div>
</template>
