<template>
  <div class="col-md-6">
    <article class="integration-card" role="listitem" :aria-label="`Интеграция ${integration.provider}, статус ${status.label}`">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h3>{{ integration.provider }}</h3>
          <p class="text-secondary mb-0">{{ formatLastSync(integration.lastSyncAt, integration.status) }}</p>
        </div>
        <span class="status-pill" :class="status.className">{{ status.label }}</span>
      </div>
      <div class="d-flex gap-2 mt-4">
        <button class="btn btn-outline-dark btn-sm" type="button" @click="$emit('import', integration)">
          Импортировать
        </button>
        <button class="btn btn-light btn-sm" type="button">{{ integration.status === "warning" ? "Переподключить" : "Настройки" }}</button>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatLastSync } from "@/utils/formatters";

defineEmits(["import"]);

const props = defineProps({
  integration: {
    type: Object,
    required: true,
  },
});

const status = computed(() => {
  const statusMap = {
    active: { label: "Активно", className: "positive" },
    warning: { label: "Требует проверки", className: "warning" },
    inactive: { label: "Неактивно", className: "" },
  };

  return statusMap[props.integration.status] || statusMap.inactive;
});
</script>

