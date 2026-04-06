<template>
  <router-view></router-view>
</template>

<script setup>
import { useTheme } from './composables/useTheme'
useTheme()
</script>
