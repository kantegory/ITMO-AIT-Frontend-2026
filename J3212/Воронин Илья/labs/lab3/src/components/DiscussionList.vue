<script setup>
import { computed, ref } from 'vue';
import { useI18n } from '../composables/useI18n';

const props = defineProps({ discussions: { type: Array, required: true } });
const emit = defineEmits(['send']);

const { t } = useI18n();
const message = ref('');

const items = computed(() =>
  props.discussions.map((d) => ({
    ...d,
    formatted: d.createdAt ? new Date(d.createdAt).toLocaleString('ru-RU') : '',
  })),
);

function onSend() {
  const text = message.value.trim();
  if (!text) return;
  emit('send', text);
  message.value = '';
}
</script>

<template>
  <div>
    <div class="mb-3">
      <div v-if="!items.length" class="text-muted small mb-3">—</div>
      <div v-for="d in items" :key="d.id" class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <strong>{{ d.authorName }}</strong>
            <small class="text-muted">{{ d.formatted }}</small>
          </div>
          <p class="mb-0">{{ d.text }}</p>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <textarea
        v-model="message"
        class="form-control"
        rows="2"
        :placeholder="t('project_disc_ph')"
      ></textarea>
      <button type="button" class="btn btn-primary mt-2" @click="onSend">
        {{ t('project_send') }}
      </button>
    </div>
  </div>
</template>
