<template>
  <router-view />
  <app-toast />
</template>

<script>

import AppToast from '@/components/AppToast.vue'

export default {
  name: 'App',
  components: { AppToast }
}

</script>
