<script setup lang="ts">
import { computed } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { useTheme } from '../composables/useTheme';

defineProps<{ floating?: boolean }>();

const { theme, toggle } = useTheme();

const isLight = computed(() => theme.value === 'light');
const label = computed(() =>
  isLight.value ? 'Переключить на тёмную тему' : 'Переключить на светлую тему',
);
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :class="{ 'theme-toggle-floating': floating, 'icon-btn': !floating }"
    :aria-pressed="isLight"
    :aria-label="label"
    :title="isLight ? 'Тёмная тема' : 'Светлая тема'"
    @click="toggle"
  >
    <SvgIcon v-show="!isLight" name="moon" data-icon="moon" />
    <SvgIcon v-show="isLight" name="sun" data-icon="sun" />
  </button>
</template>
