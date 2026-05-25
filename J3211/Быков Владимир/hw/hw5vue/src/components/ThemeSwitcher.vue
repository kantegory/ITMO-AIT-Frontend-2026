<script setup>
import { computed, ref } from 'vue';

const savedTheme = localStorage.getItem('datamark-vue-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = ref(savedTheme || systemTheme);

function applyTheme() {
    document.documentElement.dataset.theme = theme.value;
    localStorage.setItem('datamark-vue-theme', theme.value);
}

function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    applyTheme();
}

const buttonText = computed(() => {
    return theme.value === 'dark' ? 'Светлая тема' : 'Тёмная тема';
});

applyTheme();
</script>

<template>
    <button class="theme-button" type="button" @click="toggleTheme">
        {{ buttonText }}
    </button>
</template>
