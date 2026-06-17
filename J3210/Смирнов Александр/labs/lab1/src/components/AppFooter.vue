<template>
    <footer class="site-footer py-3 mt-auto">
        <div class="container text-center">
            <small>© {{ year }} AI Hub. ITMO Frontend Lab.</small>
        </div>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
