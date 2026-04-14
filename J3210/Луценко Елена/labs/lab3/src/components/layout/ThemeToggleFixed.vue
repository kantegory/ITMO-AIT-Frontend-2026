<script setup>
import {useTheme} from '@/composables/useTheme.js'

const {theme, toggleTheme} = useTheme()
</script>

<template>
    <button @click="toggleTheme" class="theme-toggle-fixed" title="Сменить тему">
        <svg class="icon">
            <use :href="`/sprite.svg#icon-${theme === 'light' ? 'moon' : 'sun'}`"></use>
        </svg>
    </button>
</template>
