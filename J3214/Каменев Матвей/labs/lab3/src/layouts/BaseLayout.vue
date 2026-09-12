<script setup>
import NavbarComponent from '@/components/common/NavbarComponent.vue'
import FooterComponent from '@/components/common/FooterComponent.vue'
</script>

<template>
  <navbar-component />
  <slot />
  <footer-component />
</template>
