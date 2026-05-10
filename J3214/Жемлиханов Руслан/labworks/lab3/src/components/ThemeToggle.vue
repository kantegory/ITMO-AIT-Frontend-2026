<template>
  <button class="btn btn-outline-secondary theme-toggle" type="button" :aria-label="label" @click="toggleTheme">
    <IconSprite :name="theme === 'dark' ? 'icon-sun' : 'icon-moon'" size="sm" />
    <span>{{ theme === 'dark' ? 'Светлая тема' : 'Темная тема' }}</span>
  </button>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import IconSprite from './IconSprite.vue';
import { useTheme } from '../composables/useTheme';

const { theme, applyTheme, toggleTheme } = useTheme();

const label = computed(() => (theme.value === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'));

onMounted(() => applyTheme());
</script>
