<script setup>
import AppHeader from './components/AppHeader.vue';
</script>

<template>
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>

    <AppHeader />

    <main id="main-content" class="container page" tabindex="-1">
        <RouterView />
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <span>DataMark, 2026</span>
            <span class="muted">Vue SPA л3</span>
        </div>
    </footer>
</template>
gi