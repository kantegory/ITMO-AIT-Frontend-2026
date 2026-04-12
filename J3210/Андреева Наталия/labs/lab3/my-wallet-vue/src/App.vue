<template>
  <div :class="{'bg-light': !isDark, 'min-vh-100': true}">

    <button
        v-if="!showNavbar"
        class="btn theme-toggle-btn btn-sm fw-bold floating-theme-btn"
        @click="toggleTheme"
    >
      ТЕМА: {{ isDark ? 'ТЕМНАЯ' : 'СВЕТЛАЯ' }}
    </button>

    <Navbar v-if="showNavbar"/>

    <router-view/>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useTheme} from './composables/useTheme'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const {isDark, toggleTheme} = useTheme()

const showNavbar = computed(() => !['login', 'register'].includes(route.name))
</script>