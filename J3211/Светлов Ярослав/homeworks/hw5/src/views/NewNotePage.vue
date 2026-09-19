<template><h1 class="h3" tabindex="-1">Новая заметка</h1><NoteForm @saved="router.push('/')" /></template>
<script setup>
import { useRouter } from 'vue-router';
import NoteForm from '../components/NoteForm.vue';
const router = useRouter();
</script>
