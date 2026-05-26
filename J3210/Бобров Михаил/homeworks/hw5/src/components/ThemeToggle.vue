<script setup>
import { computed } from "vue";
import SvgIcon from "./SvgIcon.vue";
import { theme, toggleTheme } from "../theme.js";

const label = computed(() => theme.value === "dark" ? "Светлая" : "Тёмная");
</script>

<template>
    <button class="btn btn-light btn-sm theme-toggle" type="button" :aria-label="`Включить тему: ${label.toLowerCase()}`" @click="toggleTheme">
        <SvgIcon name="theme" />{{ label }}
    </button>
</template>
