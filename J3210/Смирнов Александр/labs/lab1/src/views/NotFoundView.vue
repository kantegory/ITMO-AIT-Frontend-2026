<template>
    <BaseLayout>
        <div class="text-center py-5">
            <h1>404</h1>
            <p class="text-muted">Page not found.</p>
            <RouterLink to="/" class="btn btn-primary">Go to catalog</RouterLink>
        </div>
    </BaseLayout>
</template>

<script setup>
import BaseLayout from "../layouts/BaseLayout.vue";
</script>
