<template>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppHeader />

    <main id="main-content" class="container" tabindex="-1">
        <slot />
    </main>

    <AppFooter />
</template>

<script setup>
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
</script>
