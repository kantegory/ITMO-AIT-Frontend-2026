<script setup>
import { ref, computed } from 'vue';
import SvgIcon from '@/components/ui/SvgIcon.vue';

const props = defineProps({
  icon: { type: String, required: true }, // sprite id, e.g. 'star'
  iconActive: { type: String, default: '' }, // sprite id when active
  count: { type: Number, required: true },
  label: { type: String, required: true }, // a11y label prefix
});

const active = ref(false);

const displayCount = computed(() => props.count + (active.value ? 1 : 0));
const displayIcon = computed(() =>
  active.value && props.iconActive ? props.iconActive : props.icon,
);
const ariaLabel = computed(() => `${props.label}, сейчас ${displayCount.value}`);

function toggle() {
  active.value = !active.value;
}
</script>

<template>
  <button
    type="button"
    class="stat-btn"
    :class="{ active }"
    :aria-label="ariaLabel"
    :aria-pressed="active"
    @click="toggle"
  >
    <SvgIcon :name="displayIcon" />
    <span class="visually-hidden">{{ label }}:</span>
    <span>{{ displayCount.toLocaleString('ru-RU') }}</span>
  </button>
</template>
