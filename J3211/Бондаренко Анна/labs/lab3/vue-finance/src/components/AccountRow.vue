<template>
  <tr>
    <td>{{ name }}</td>
    <td>{{ balance.toFixed(2) }}</td>
  </tr>
</template>

<script setup>
defineProps(['name', 'balance'])
</script>