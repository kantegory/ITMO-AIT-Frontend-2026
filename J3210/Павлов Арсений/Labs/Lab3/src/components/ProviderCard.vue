<script setup>
const props = defineProps({
  provider: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['manage']);

function onManage() {
  emit('manage', props.provider);
}
</script>

<template>
  <article class="integration-card">
    <h3 class="h6 mb-2">{{ provider.name }}</h3>
    <p class="integration-status mb-3">Статус: {{ provider.status === 'connected' ? 'подключено' : 'не подключено' }}</p>
    <button class="btn btn-sm btn-outline-accent" type="button" @click="onManage">
      {{ provider.status === 'connected' ? 'Управлять' : 'Подключить' }}
    </button>
  </article>
</template>
