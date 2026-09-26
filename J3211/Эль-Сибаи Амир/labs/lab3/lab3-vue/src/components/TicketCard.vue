<template>
  <div class="ticket-card" :style="{ opacity: status === 'Refunded' ? 0.5 : 1 }">
    <div class="result-row" :style="{ background: grad, alignItems: 'center', display: 'flex' }">
      <span class="club-left" :style="[leftStyle, {flex: '1 1 0', textAlign: 'center'}]">{{ left }}</span>
      <span class="result-score" :style="[scoreStyle, {flexShrink: 0, margin: '0 10px'}]">vs</span>
      <span class="club-right" :style="[rightStyle, {flex: '1 1 0', textAlign: 'center'}]">{{ right }}</span>
    </div>
    <div class="ticket-info" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div class="d-flex flex-column">
        <span class="text-muted" style="font-size: 0.85rem;">{{ category }} <span v-if="qty">({{ qty }})</span></span>
        <strong style="font-size: 1.1rem;">€{{ total }}</strong>
      </div>
      <div class="ms-auto">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['left', 'right', 'leftStyle', 'rightStyle', 'scoreStyle', 'grad', 'category', 'total', 'status', 'qty'])
</script>
