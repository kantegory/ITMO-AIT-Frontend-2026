<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useLocale } from './composables/useLocale'

const { locale } = useLocale()

document.documentElement.lang = locale.value
watch(locale, (lang) => { document.documentElement.lang = lang })
</script>
