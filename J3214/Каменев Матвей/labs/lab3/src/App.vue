<script setup>
import 'bootstrap'

import { RouterView } from 'vue-router'

import SvgSprite from '@/components/common/SvgSprite.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'
import useTheme from '@/composables/useTheme'

useTheme()
</script>

<template>
  <svg-sprite />
  <RouterView />
  <login-modal />
  <register-modal />
</template>
