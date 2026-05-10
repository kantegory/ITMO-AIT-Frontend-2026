<template>
  <div v-if="integration" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="importModalTitle">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header border-0">
          <div>
            <span class="section-label">Импорт операций</span>
            <h2 id="importModalTitle" class="h4 mb-0">{{ integration.provider }}</h2>
          </div>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="$emit('close')"></button>
        </div>
        <div class="modal-body pt-0">
          <p class="text-secondary">Выберите период, чтобы добавить демо-транзакции от выбранного провайдера.</p>
          <label class="form-label" for="importRange">Период</label>
          <select id="importRange" v-model="period" class="form-select">
            <option>Последние 7 дней</option>
            <option>Последние 30 дней</option>
            <option>Последние 90 дней</option>
          </select>
          <div v-if="message" class="alert alert-danger mt-3 mb-0" role="alert">{{ message }}</div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-accent w-100" :disabled="isBusy" @click="importTransactions">
            {{ isBusy ? "Импортируем..." : "Начать импорт" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="integration" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import { useAuth } from "@/composables/useAuth";
import { buildImportedTransactions } from "@/services/defaultData";

const emit = defineEmits(["close", "imported"]);

const props = defineProps({
  integration: {
    type: Object,
    default: null,
  },
});

const { apiRequest } = useApi();
const auth = useAuth();
const period = ref("Последние 30 дней");
const isBusy = ref(false);
const message = ref("");

async function importTransactions() {
  if (!props.integration) return;

  message.value = "";
  isBusy.value = true;

  try {
    const currentSession = await auth.ensureSession();
    const importedTransactions = buildImportedTransactions(currentSession.user.id, props.integration.provider, period.value);
    await Promise.all(importedTransactions.map((item) => apiRequest("/transactions", { method: "POST", body: item })));
    const patchedIntegration = await apiRequest(`/integrations/${props.integration.id}`, {
      method: "PATCH",
      body: { lastSyncAt: new Date().toISOString(), status: "active" },
    });

    emit("imported", patchedIntegration);
    emit("close");
  } catch (error) {
    message.value = error.message || "Импорт не удался.";
  } finally {
    isBusy.value = false;
  }
}
</script>

