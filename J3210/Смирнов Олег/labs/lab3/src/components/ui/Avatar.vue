<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: 'sm' }, // sm | lg
});

const initial = computed(() => (props.name ? props.name.charAt(0).toUpperCase() : '?'));
const cssClass = computed(() => (props.size === 'lg' ? 'avatar avatar-lg' : 'avatar'));
const inlineStyle = computed(() =>
  props.size === 'sm' ? 'width:2em;height:2em;font-size:.85rem;' : '',
);
</script>

<template>
  <div :class="cssClass" :style="inlineStyle">{{ initial }}</div>
</template>
