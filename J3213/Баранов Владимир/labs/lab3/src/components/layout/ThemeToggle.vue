<script setup>
import { computed } from "vue";
import { useTheme } from "@/composables/useTheme.js";

const { currentTheme, toggleTheme } = useTheme();

const isLab = computed(() => currentTheme.value === "lab");
const title = computed(() =>
    isLab.value ? "Сейчас тема Lab — переключить на Pipeline" : "Сейчас тема Pipeline — переключить на Lab"
);
const label = computed(() => (isLab.value ? "Включить тёмную тему Pipeline" : "Включить светлую тему Lab"));
</script>

<template>
    <button
        type="button"
        class="btn btn-theme-toggle ms-lg-2"
        :aria-pressed="!isLab"
        :aria-label="label"
        :title="title"
        @click="toggleTheme"
    >
        <span class="btn-theme-toggle__icon" v-if="isLab" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8l4 4-4 4M14 16h4" />
            </svg>
        </span>
        <span class="btn-theme-toggle__icon" v-else aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
        </span>
    </button>
</template>
