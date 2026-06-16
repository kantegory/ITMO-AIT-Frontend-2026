<script setup>
import { RouterView, useRoute } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'

const route = useRoute()
</script>

<template>
  <HeaderComponent v-if="!['login', 'register'].includes(route.name)" />
  <RouterView />
</template>
