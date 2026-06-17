<template>
  <button class="btn btn-outline-secondary" type="button" @click="toggleTheme" :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'">
    <IconSprite :name="isDark ? 'sun' : 'moon'" />
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';
import IconSprite from './IconSprite.vue';

const { isDark, toggleTheme } = useTheme();
</script>
