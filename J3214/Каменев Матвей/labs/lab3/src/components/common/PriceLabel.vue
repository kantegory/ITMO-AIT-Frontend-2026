<script setup>
import useCurrency from '@/composables/useCurrency'

const props = defineProps({
  rub: {
    type: Number,
    default: null,
  },
  suffix: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: 'span',
  },
})

const { formatPrice } = useCurrency()
</script>

<template>
  <component :is="props.tag">{{ props.rub === null ? 'Бесплатно' : formatPrice(props.rub, props.suffix) }}</component>
</template>
