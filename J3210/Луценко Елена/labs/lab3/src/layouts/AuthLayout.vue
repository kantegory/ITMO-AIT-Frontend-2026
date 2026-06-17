<script setup>
import ThemeToggleFixed from '@/components/layout/ThemeToggleFixed.vue'
</script>

<template>
    <div class="auth-layout d-flex align-items-center min-vh-100">
        <ThemeToggleFixed/>
        <slot/>
    </div>
</template>
