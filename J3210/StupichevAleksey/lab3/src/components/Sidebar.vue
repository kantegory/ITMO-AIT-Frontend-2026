<template>
  <ul class="list-unstyled mb-0 py-2">
    <li v-for="link in links" :key="link.to">
      <router-link
        :to="link.to"
        class="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
        :class="isActive(link.to) ? 'text-white sidebar-active' : 'text-white-50'"
      >
        <i :class="`bi ${link.icon}`"></i>
        <span style="font-size:.9rem">{{ link.label }}</span>
      </router-link>
    </li>
    <li class="border-top border-secondary my-2"></li>
    <li>
      <a
        href="#"
        class="d-flex align-items-center gap-2 px-3 py-2 text-white-50 text-decoration-none"
        style="font-size:.9rem"
        @click.prevent="emit('logout')"
      >
        <svg class="icon">
          <use href="#icon-box-arrow-left"></use>
        </svg>
        <span>Выйти</span>
      </a>
    </li>
  </ul>
</template>

<script setup>
import {useRoute} from 'vue-router'

defineProps({
  links: {type: Array, required: true},
})

const emit = defineEmits(['logout'])
const route = useRoute()

function isActive(to) {
  return route.path === to
}
</script>

<style scoped>
.sidebar-active {
  background: rgba(13, 110, 253, 0.25);
}
</style>
