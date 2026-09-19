<template>
  <p v-if="!artifacts.length">Артефактов пока нет.</p>
  <ul v-else><li v-for="item in artifacts" :key="item.url"><a class="artifact-link" :href="item.url" download><SvgIcon name="file" /> {{ item.name }}</a> <small>({{ item.size }} байт)</small></li></ul>
</template>
<script setup>
import SvgIcon from './SvgIcon.vue';
defineProps({ artifacts: { type: Array, required: true } });
</script>
