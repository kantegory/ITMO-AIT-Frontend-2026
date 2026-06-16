<script setup lang="ts">
import spriteUrl from '../../assets/sprite.svg?url';

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    dataIcon?: string;
  }>(),
  { size: 16 },
);

const href = `${spriteUrl}#icon-${props.name}`;
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    :data-icon="dataIcon"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="href" />
  </svg>
</template>
