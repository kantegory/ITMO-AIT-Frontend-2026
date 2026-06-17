<template>
  <app-sidebar v-if="$route.name !== 'login' && $route.name !== 'register'" />
  
  <router-view />
</template>

<script>
import AppSidebar from './components/AppSidebar.vue'

export default {
  name: 'App',
  components: {
    AppSidebar
  }
}
</script>