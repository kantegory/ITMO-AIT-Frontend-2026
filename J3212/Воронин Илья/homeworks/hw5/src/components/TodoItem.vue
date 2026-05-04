<script setup>
const props = defineProps({
  item: { type: Object, required: true },
});
defineEmits(['toggle', 'remove']);
</script>

<template>
  <li :class="{ done: item.done }">
    <label class="row" style="cursor: pointer">
      <input type="checkbox" :checked="item.done" @change="$emit('toggle', item.id)" />
      <span>{{ item.text }}</span>
    </label>
    <button class="secondary" type="button" @click="$emit('remove', item.id)">Удалить</button>
  </li>
</template>
