<template>
  <button
    class="btn btn-theme btn-sm px-3"
    type="button"
    :aria-pressed="String(isGraphite)"
    :aria-label="`Переключить тему. Сейчас выбрана тема ${themeLabel}`"
    :title="`Переключить тему. Сейчас выбрана тема ${themeLabel}`"
    @click="toggleTheme"
  >
    <SvgIcon name="palette" class-name="icon--inline" />
    <span>{{ themeLabel }}</span>
  </button>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { useTheme } from "@/composables/useTheme";

const { isGraphite, themeLabel, toggleTheme } = useTheme();
</script>

