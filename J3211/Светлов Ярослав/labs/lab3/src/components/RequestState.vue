<template><p v-if="loading" role="status">Загрузка…</p><p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p></template>
<script setup>defineProps({ loading: Boolean, error: String });</script>
